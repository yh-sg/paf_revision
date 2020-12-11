import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Todo } from '../model';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  form: FormGroup
  array:Todo[] = []

  todayDate = new Date()

  now = new Date();
  day = ("0" + this.now.getDate()).slice(-2);
  month = ("0" + (this.now.getMonth() + 1)).slice(-2);
  today = this.now.getFullYear()+"-"+(this.month)+"-"+(this.day);

  constructor(private fb:FormBuilder, private todoSvc: TodoService, private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: this.fb.control('',[Validators.required, Validators.min(1)]),
      dueDate: this.fb.control(this.today, [Validators.required]),
      priority: this.fb.control("", [Validators.required])
    })
    this.getTodo();
  }

  async getTodo(){
    this.array = await this.todoSvc.getAllTodo();
  }

  add(){
    console.log(this.form.value);
    // this.array.push({
    //   name: this.form.value.name,
    //   dueDate: this.form.value.dueDate,
    //   priority: this.form.value.priority,
    // })
    let name = this.form.get("name").value;
    let dueDate = this.form.get("dueDate").value;
    let priority = this.form.get("priority").value;

    this.todoSvc.addTodo({name, dueDate, priority} as Todo);

    this.form.reset();

    this.router.navigate(["/"]);
  }

  click(i, todoId){
    console.log(this.array[i]);
    this.router.navigate(["/subtodo", todoId])
  }

}
