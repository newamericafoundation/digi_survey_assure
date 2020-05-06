import * as knex from 'knex';
import * as knexConfig from '../../knexfile';

export const connection = knex(knexConfig);

// Possible migration solution, a "noop":
// https://stackoverflow.com/questions/12713564/function-in-javascript-that-can-be-called-only-once
