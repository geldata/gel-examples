import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getFormData } from 'remix-params-helper';
import { z } from 'zod';
import e from '$db';
import { client } from '$lib/edgedb';

export const load: PageServerLoad = async ({ locals }) => {
	// locals.userid comes from src/hooks.server.ts
	const todos = await e
		.select(e.Todo, (todo) => ({
			id: true,
			text: true,
			done: true,
			filter: e.op(todo.created_by, '=', e.uuid(locals.userid))
		}))
		.run(client);

	return { todos };
};

export const actions: Actions = {
	addTodo: async ({ request, locals }) => {
		const schema = z.object({
			text: z.string()
		});
		const { data, errors, success } = await getFormData(request, schema);

		if (!success) {
			return fail(400, errors);
		}

		await e
			.insert(e.Todo, {
				text: data.text,
				created_by: locals.userid
			})
			.run(client);
	},
	editTodo: async ({ request }) => {
		const schema = z.object({
			id: z.string().uuid(),
			text: z.string().optional(),
			done: z.boolean().optional()
		});
		const { data, errors, success } = await getFormData(request, schema);

		if (!success) {
			return fail(400, errors);
		}

		const { id, text, done } = data;
		await e
			.update(e.Todo, () => ({
				filter_single: { id },
				set: { text, done }
			}))
			.run(client);
	},
	deleteTodo: async ({ request }) => {
		const schema = z.object({
			id: z.string().uuid()
		});
		const { data, errors, success } = await getFormData(request, schema);

		if (!success) {
			return fail(400, errors);
		}

		await e
			.delete(e.Todo, () => ({
				filter_single: { id: data.id }
			}))
			.run(client);
	}
};
