# /opt/custom/my_crud_op/controllers/frontend_controller.py
from odoo import http
from odoo.http import request

class FrontendController(http.Controller):
    @http.route('/my_crud', type='http', auth='user')
    def index(self, **kwargs):
        return request.render('my_crud_op.index_template')
