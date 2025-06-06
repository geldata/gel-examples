import { useRef } from "react";
import useSWR, { mutate } from "swr";

import { CheckIcon, DeleteIcon, SendIcon } from "./icons";

export interface Todo {
  id: string;
  content: string;
  completed: boolean;
  created_on: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

async function todoAction(method: "POST" | "PATCH" | "DELETE", data: any) {
  return (
    await fetch("/api/todos", {
      method,
      ...(data
        ? {
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          }
        : {}),
    })
  ).json();
}

export function TodosList() {
  const { data: todos, mutate } = useSWR<Todo[]>("/api/todos", fetcher);

  const ref = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col gap-3 mt-4">
      <form
        ref={ref}
        onSubmit={async (e) => {
          e.preventDefault();
          const newTodo =
            new FormData(e.currentTarget).get("new-todo")?.toString() ?? "";

          if (newTodo) {
            mutate(
              async (todos) => [
                await todoAction("POST", { content: newTodo }),
                ...(todos ?? []),
              ],
              {
                optimisticData: (todos) => [
                  {
                    id: `new-${Math.random()}`,
                    content: newTodo,
                    completed: false,
                    created_on: new Date().toString(),
                  },
                  ...(todos ?? []),
                ],
              }
            );
            ref.current?.reset();
          }
        }}
        className="flex bg-slate-50 border border-slate-200 rounded-xl mb-4 overflow-hidden outline-sky-500 outline-[3px] focus-within:outline focus-within:bg-white"
      >
        <input
          name="new-todo"
          placeholder="Add new todo..."
          className="flex-grow bg-transparent pl-5 text-lg focus:outline-none focus-visible:ring-0"
        />
        <button
          className="h-9 w-9 p-3 box-content flex items-center justify-center text-sky-500"
          tabIndex={-1}
        >
          <SendIcon />
        </button>
      </form>

      {todos?.length ? (
        groupTodos(todos, (todo: Todo) => (
          <TodoCard key={todo.id} todo={todo} />
        ))
      ) : (
        <div className="border-dashed border-2 border-slate-300 text-slate-500 h-8 py-4 px-8 box-content flex items-center rounded-xl">
          {todos ? "You have no todo's" : "Loading todo's..."}
        </div>
      )}
    </div>
  );
}

function groupTodos(todos: Todo[], render: (todo: Todo) => JSX.Element) {
  const now = Date.now();
  const groupedTodos = todos.reduce(
    (groups, todo) => {
      const createdOn = new Date(todo.created_on).getTime();
      if (createdOn > now - 24 * 60 * 60 * 1000) {
        groups.today.push(todo);
      } else if (createdOn > now - 48 * 60 * 60 * 1000) {
        groups.yesterday.push(todo);
      } else if (createdOn > now - 7 * 24 * 60 * 60 * 1000) {
        groups.thisWeek.push(todo);
      } else {
        groups.older.push(todo);
      }
      return groups;
    },
    {
      today: [] as Todo[],
      yesterday: [] as Todo[],
      thisWeek: [] as Todo[],
      older: [] as Todo[],
    }
  );

  return (
    <>
      {groupedTodos.today.length ? (
        <>
          <h2 className="font-medium mt-2">Today</h2>
          {groupedTodos.today.map((todo) => render(todo))}
        </>
      ) : null}
      {groupedTodos.yesterday.length ? (
        <>
          <h2 className="font-medium mt-2">Yesterday</h2>
          {groupedTodos.yesterday.map((todo) => render(todo))}
        </>
      ) : null}
      {groupedTodos.thisWeek.length ? (
        <>
          <h2 className="font-medium mt-2">This week</h2>
          {groupedTodos.thisWeek.map((todo) => render(todo))}
        </>
      ) : null}
      {groupedTodos.older.length ? (
        <>
          <h2 className="font-medium mt-2">Older than a week</h2>
          {groupedTodos.older.map((todo) => render(todo))}
        </>
      ) : null}
    </>
  );
}

export function TodoCard({ todo }: { todo: Todo }) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-4 text-lg flex hover:scale-[1.02] transition-transform duration-75">
      <button
        onClick={() =>
          mutate<Todo[]>(
            "/api/todos",
            async (todos) => {
              const updated = await todoAction("PATCH", {
                id: todo.id,
                completed: !todo.completed,
              });
              return todos?.map((t) => (t.id === updated.id ? updated : t));
            },
            {
              optimisticData: (todos) =>
                todos?.map((t) =>
                  t.id === todo.id ? { ...todo, completed: !todo.completed } : t
                ) ?? [],
              revalidate: false,
            }
          )
        }
        className={`w-9 h-9 rounded-full mr-4 flex-shrink-0 flex items-center justify-center cursor-pointer ${
          todo.completed ? "bg-sky-400 text-white" : "border border-slate-400"
        }`}
      >
        {todo.completed ? <CheckIcon /> : null}
      </button>

      <span
        className={`flex-shrink overflow-hidden break-words py-1 mr-auto ${
          todo.completed ? "line-through opacity-70" : ""
        }`}
      >
        {todo.content}
      </span>

      {!todo.id.startsWith("new-") ? (
        <button
          onClick={() =>
            mutate<Todo[]>(
              "/api/todos",
              async (todos) => {
                const { id } = await todoAction("DELETE", { id: todo.id });
                return todos?.filter((t) => t.id !== id);
              },
              {
                optimisticData: (todos) =>
                  todos?.filter((t) => t.id !== todo.id) ?? [],
                revalidate: false,
              }
            )
          }
          className="w-9 h-9 rounded-full ml-4 flex-shrink-0 flex items-center justify-center cursor-pointer text-slate-400 hover:bg-rose-500 hover:text-white"
        >
          <DeleteIcon />
        </button>
      ) : null}
    </div>
  );
}
