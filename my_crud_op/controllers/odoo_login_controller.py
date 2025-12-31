from odoo import http
from odoo.http import request
import json

class LoginController(http.Controller):

    @http.route('/api/odoo_login', 
                auth='public', 
                cors='*',
                csrf=False,
                methods=['POST', 'OPTIONS'],
                type='http')
    def odoo_login(self, **kwargs):

        # Handle preflight OPTIONS
        if request.httprequest.method == "OPTIONS":
            headers = [
                ('Access-Control-Allow-Origin', '*'),
                ('Access-Control-Allow-Methods', 'POST, OPTIONS'),
                ('Access-Control-Allow-Headers', 'Content-Type, Authorization'),
            ]
            return request.make_response("", headers=headers)

        # Handle POST
        data = json.loads(request.httprequest.data.decode())
        email = data.get("email")
        password = data.get("password")

        user = request.env['res.users'].sudo().search([('login', '=', email)], limit=1)

        if not user:
            result = {'success': False, 'message': 'User not found'}
        else:
            try:
                uid = request.session.authenticate(request.env.cr.dbname, email, password)
                result = {'success': True, 'user_id': uid}
            except:
                result = {'success': False, 'message': 'Invalid credentials'}

        response = request.make_response(json.dumps(result))
        response.headers['Content-Type'] = 'application/json'
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response
