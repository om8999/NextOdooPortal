from odoo import http, fields, api
from odoo.http import request
import json
import time

class ApiDemoController(http.Controller):
    # -----------------------
    # Sync compute: immediate return
    # -----------------------
    @http.route('/api/compute_sync', type='json', auth='public', methods=['POST'], csrf=False, cors='*')
    def compute_sync(self, **payload):
        """
        Example synchronous endpoint. Receives JSON payload, does computation using Odoo env,
        and returns JSON. type='json' simplifies JSON parsing/returning.
        """
        # payload is already a dict for type='json':
        param = payload.get('param', 0)

        # Example: use ORM in compute
        # product_count = request.env['product.template'].sudo().search_count([])
        # heavy compute simulated:
        result_val = self._heavy_compute(param)

        return {
            'ok': True,
            'result': result_val,
        }

    def _heavy_compute(self, value):
        # put logic here: use request.env to access DB if needed
        # simulate CPU work
        x = 0
        for i in range(200000 + int(value or 0)):
            x += (i % 7)
        return x

    # -----------------------
    # Async compute (background job + status)
    # Requires queue_job or your own job runner
    # -----------------------
    @http.route('/api/compute_async', type='http', auth='public', methods=['POST', 'OPTIONS'], csrf=False, cors='*')
    def compute_async(self, **kwargs):
        # handle OPTIONS preflight (for type='http' you must do this)
        print("--------------->>>>>>>>>>IN THIS<<<<<<<<<<<<<<<<<<<")
        if request.httprequest.method == 'OPTIONS':
            return request.make_response('', headers=[
                ('Access-Control-Allow-Origin', '*'),
                ('Access-Control-Allow-Methods', 'POST, OPTIONS'),
                ('Access-Control-Allow-Headers', 'Content-Type, Authorization'),
            ])

        try:
            data = request.httprequest.get_data(as_text=True)
            payload = json.loads(data or "{}")
        except Exception:
            payload = kwargs

        param = payload.get('param', 0)

        # Option A — start quick background job using env.cr (simple example)
        # WARNING: In production, use queue_job/worker or Odoo's job framework.
        # This demo starts a new thread/process would be needed for real background work;
        # here we store a simple job record to poll for status.

        Job = request.env['ir.logging']  # placeholder model; create your own job model for real use

        # naive "job id"
        job_id = int(time.time() * 1000)

        # store a simple key in ir.config_parameter (demo only!)
        request.env['ir.config_parameter'].sudo().set_param(f'api_demo.job.{job_id}.status', 'queued')

        # In real setup you would enqueue actual work to a worker, e.g. using queue_job:
        # request.env['your.job.model'].sudo().create({...}) or queue_job decorator

        # For demonstration, return a job id the frontend can poll
        return request.make_response(
            json.dumps({'ok': True, 'job_id': job_id}),
            headers=[
                ('Content-Type', 'application/json'),
                ('Access-Control-Allow-Origin', '*'),
                ('Access-Control-Allow-Methods', 'POST, OPTIONS'),
                ('Access-Control-Allow-Headers', 'Content-Type, Authorization'),
            ]
        )

    # Example polling endpoint to check job status (demo)
    @http.route('/api/job_status/<string:job_id>', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False, cors='*')
    def job_status(self, job_id):
        if request.httprequest.method == 'OPTIONS':
            return request.make_response('', headers=[
                ('Access-Control-Allow-Origin', '*'),
                ('Access-Control-Allow-Methods', 'GET, OPTIONS'),
                ('Access-Control-Allow-Headers', 'Content-Type, Authorization'),
            ])
        status = request.env['ir.config_parameter'].sudo().get_param(f'api_demo.job.{job_id}.status', default='unknown')
        return request.make_response(json.dumps({'job_id': job_id, 'status': status}), headers=[
            ('Content-Type', 'application/json'),
            ('Access-Control-Allow-Origin', '*'),
        ])
