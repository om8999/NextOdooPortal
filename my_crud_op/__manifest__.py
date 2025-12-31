# -*- coding: utf-8 -*-
{
    'name': 'UI Integration',
    'version': '1.0.0',
    'category': 'UI Integratopn',
    'summary': 'UI Integratopn',
    'description': """
       In This module we store all Book Details
    """,
    'depends': ['base','sale','purchase','web'],
    'data': [
        
        'views/frontend_templates.xml',
        'views/product_view.xml',
        'security/ir.model.access.csv',
        
    ],
    'assets': {
        'web.assets_frontend': [
            'my_crud_op/static/src/js/*.js',
            'my_crud_op/static/src/css/*.css',
        ]
    },
    'demo': [],
    'installable': True,
    
}
