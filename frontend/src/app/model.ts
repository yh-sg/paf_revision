export interface Todo {
    name: string;
    dueDate: string;
    priority: string;
}

export interface Subtodo {
    subname: string;
    subpriority: string;
    todo_id: number;
}