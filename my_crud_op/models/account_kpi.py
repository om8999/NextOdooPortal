# models/account_kpi.py
from odoo import models,api

class AccountKPI(models.Model):
    _name = "account.kpi"
    _description = "Accounting KPIs"
    _auto = False
    
    @api.model
    def avg_reconcile_time(self):
        self.env.cr.execute("""
            SELECT COALESCE(
                ROUND(
                    AVG(
                        DATE_PART('day', pr.create_date - aml.date)
                    )::numeric,
                    2
                ),
                0
            )
            FROM account_partial_reconcile pr
            JOIN account_move_line aml
                ON aml.id = pr.debit_move_id
                OR aml.id = pr.credit_move_id
            JOIN account_account aa
                ON aa.id = aml.account_id
            WHERE aa.reconcile = true
        """)
        res = self.env.cr.fetchone()
        return res[0] if res and res[0] is not None else 0

