import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-sub-todo',
  templateUrl: './sub-todo.component.html',
  styleUrls: ['./sub-todo.component.css']
})
export class SubTodoComponent implements OnInit {

  form: FormGroup

  todoId
  array:any[] = []

  constructor(private fb: FormBuilder, private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private todoSvc:TodoService) { }

  ngOnInit(): void {
    this.todoId = this.activatedRoute.snapshot.params.id
    this.getSubTodo()
    this.form = this.fb.group({
      subname: this.fb.control('',[Validators.required, Validators.min(1)]),
      subpriority: this.fb.control("", [Validators.required])
    })
  }

  async getSubTodo(){
    this.array = await this.todoSvc.subTodo(this.todoId);
  }

  add(){
    console.log(this.form.value);
    let todo_id = this.todoId;
    let subname = this.form.get("subname").value;
    let subpriority = this.form.get("subpriority").value;

    this.todoSvc.addSubtodo({subname,subpriority,todo_id})

    this.form.reset();
  }

  delete(id){
    console.log("DELETE!");
    this.todoSvc.delSubtodo(id);
  }

  edit(id){
    this.router.navigate(["/edit", id])
  }

  backtoTodo(){
    this.router.navigate([""]);
  }

}
