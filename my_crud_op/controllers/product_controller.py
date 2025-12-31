# -*- coding: utf-8 -*-

# my_crud_module/controllers/product_controller.py
from odoo import http
from odoo.http import request
import json

class ProductController(http.Controller):
    API_URL = '/api/products'
    # Create
    @http.route(API_URL, type='http', auth='user', methods=['POST'], csrf=False)
    def create_product(self, **kwargs):
        import json
        data = json.loads(request.httprequest.data or '{}')
        name = data.get('name') or 'Unnamed Product'
        price = float(data.get('price', 0.0))
        description = data.get('description', '')

        product = request.env['crud.product'].sudo().create({
            'name': name,
            'price': price,
            'description': description,
        })

        return request.make_json_response({
            'id': product.id,
            'name': product.name,
            'price': product.price,
        })

    # Read all
    @http.route(API_URL, type='http', auth='user', methods=['GET'], csrf=False)
    def get_products(self):
        products = request.env['crud.product'].sudo().search([])
        data = [{'id': p.id, 'name': p.name, 'price': p.price, 'description': p.description} for p in products]
        return request.make_json_response(data)

    # Read one
    @http.route('/api/products/<int:product_id>', type='json', auth='user', methods=['GET'])
    def get_product(self, product_id):
        product = request.env['crud.product'].browse(product_id)
        if not product.exists():
            return {'error': 'Product not found'}
        return {'id': product.id, 'name': product.name, 'price': product.price, 'description': product.description}

    # Update
    @http.route(API_URL + '/<int:product_id>', type='http', auth='user', methods=['PUT'], csrf=False)
    def update_product(self, product_id):
        data = json.loads(request.httprequest.data or '{}')
        product = request.env['crud.product'].sudo().browse(product_id)
        if not product.exists():
            return request.make_json_response({'error': 'Product not found'}, status=404)
        product.write({
            'name': data.get('name', product.name),
            'price': float(data.get('price', product.price)),
            'description': data.get('description', product.description)
        })
        return request.make_json_response({'id': product.id, 'name': product.name, 'price': product.price})

    # DELETE product
    @http.route(API_URL + '/<int:product_id>', type='http', auth='user', methods=['DELETE'], csrf=False)
    def delete_product(self, product_id):
        product = request.env['crud.product'].sudo().browse(product_id)
        if not product.exists():
            return request.make_json_response({'error': 'Product not found'}, status=404)
        product.unlink()
        return request.make_json_response({'status': 'deleted'})
