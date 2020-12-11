import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Subtodo, Todo } from './model';

@Injectable()

export class TodoService{
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    constructor(private http: HttpClient){}

    async getAllTodo(): Promise<Todo[]> {
        const res = await this.http.get<any>('http://localhost:3000/todo')
            .toPromise()
        console.log(res.results);
        
        return res.results as Todo[]
    }

    async subTodo(id): Promise<Todo[]> {
        const res = await this.http.get<any>(`http://localhost:3000/subtodo/${id}`)
            .toPromise()
        console.log(res.results);
        
        return res.results as Todo[]
    }

    async addTodo(todo: Todo):Promise<any> {
        return await this.http.post<any>('http://localhost:3000/addtodo',todo, this.httpOptions)
            .toPromise()
    }

    async addSubtodo(subtodo: Subtodo):Promise<any> {
        return await this.http.post<any>(`http://localhost:3000/addsubtodo/${subtodo.todo_id}`,subtodo, this.httpOptions)
            .toPromise()
    }

    async delSubtodo(id):Promise<any> {
        return await this.http.delete<any>(`http://localhost:3000/delsubtodo/${id}`)
            .toPromise()
    }
}