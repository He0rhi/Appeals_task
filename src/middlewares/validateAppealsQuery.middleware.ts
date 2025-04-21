import { query } from 'express-validator';

export const validateAppealsQuery = [
  query('date').optional().isISO8601(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
];