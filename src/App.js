import React, { Component } from 'react';
import './App.css';
const axios = require("axios");


const url ='http://localhost:3000';

const Search = props => <input placeholder="Search for parent" onChange={props.changed}/>;
const Selected = props => {
  if (! props.parent) return '...';
  return <div>
      <h4>Parent</h4>
      <h5>{props.parent.name}</h5>
      <h4>Student </h4>
      {props.students.map((student, key) => (
        <h5 key={key}>{student.name}</h5>
      ))}
      
    <input placeholder="Student Name" onChange={props.addStudent} disabled={props.parent.enrolled} />
      <button onClick={props.addStudentAction.bind()} >
        add
      </button>

    </div>; 

};
const Table = props => (
  <div>
    <p>Table</p>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Enrolled</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {props.data.map((item, key) => (
          <tr key = {key}>
            <td>{item.name}</td>
            <td>{item.enrolled ? "Yes" : "No"}</td>
            <td>
              <button onClick={props.handleClick.bind(null, item.id)}>
                enroll
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
class App extends Component {
  state = {
    parents: [],
    students: [],
    activeParentID: "",
    search: "",
    notes: "",
    addStudent:"",
  };
  getSelectedParent() {
    const id = this.state.activeParentID;
    return this.state.parents.find(parent => parent.id === id);
  }

  getSelectedStudent() {
    const id = this.state.activeParentID;
    return this.state.students.filter(student => student.parentId === id);
  }

  changed(entry) {
    const term = entry.target.value.toLowerCase();

    let newParents = this.state.parents.filter(parent => {return parent.name.toLowerCase().indexOf(term) >= 0;});

    this.setState({ parents: newParents });
  }

  addStudent(name) {
    this.setState({ addStudent: name.target.value });
  }
  addStudentAction() {
    if (this.state.addStudent !== "") {
      axios({
        method: "POST",
        url: `${url}/students`,
        data: {
          parentId: this.state.activeParentID,
          name: this.state.addStudent
        }
      });
    }
    this.setState({ addStudent: "" });
  }

  getselectedidParent(e) {
    this.setState({ addStudent:""});
    axios
      .get(`${url}/parents/` + e)
      .then(res => this.setState({ activeParentID: res.data.id }));
  }

  getParents() {
    axios
      .get(`${url}/parents`)
      .then(res => this.setState({ parents: res.data }));
  }
  getStudents() {
    axios
      .get(`${url}/students`)
      .then(res => this.setState({ students: res.data }));
  }

  componentWillMount() {
    this.getParents();
    this.getStudents();
    this.getselectedidParent();
  }

  render() {
    const selectedParent = this.getSelectedParent();
    const selectedStudents = this.getSelectedStudent();
    const parents = this.state.parents;
    return <div className="App">
        <Search changed={this.changed.bind(this)} />
        <Table data={parents} handleClick={this.getselectedidParent.bind(this)} />
        <Selected parent={selectedParent} students={selectedStudents} addStudent={this.addStudent.bind(this)} addStudentAction={this.addStudentAction.bind(this)} />
      </div>;
  }
}

export default App;
