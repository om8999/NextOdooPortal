# -*- coding: utf-8 -*-

# my_crud_module/models/product.py
from odoo import models, fields

class CrudProduct(models.Model):
    _name = 'crud.product'
    _description = 'Custom Product'

    name = fields.Char(string="Name", required=True)
    price = fields.Float(string="Price")
    description = fields.Text(string="Description")

class ProductTemplate(models.Model):
    _inherit = 'product.template'

    def open_crud_ui(self):
        return {
            "type": "ir.actions.act_url",
            "url": "/my_crud_op/static/src/html/index.html",
            "target": "new",  # open in new tab
        }