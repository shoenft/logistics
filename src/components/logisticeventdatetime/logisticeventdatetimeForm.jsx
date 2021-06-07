import React, { Component } from "react";
import Joi from "joi-browser";
import { saveLogisticeventdatetime, getLogisticeventdatetime } from "../../services/logisticeventdatetimeService";

class createLogisticeventdatetime extends Component{

 constructor(props){
super(props);
}  state = {
    data: { date: "", time: "", },
    errors: {}
  };

  scheema = {
    _id: Joi.string(),
    date:  Joi.string()
      .required()


      .label("date"),
    time:  Joi.string()
      .allow('').allow(null)



      .label("time"),
    createdAt: Joi.date()
      .label("createAt")
  };

  async populateForm() {
    try {
      const logisticeventdatetimeId = this.props.match.params.id;
      if(logisticeventdatetimeId!=="new"){
        const { data } = await getLogisticeventdatetime(logisticeventdatetimeId);
        this.setState({ data });
      }    
    } 
    catch (ex) {
      if (ex.response && ex.response.status === 404) {
        this.props.history.replace("/not-found"); 
      }
    }
  }

  async componentDidMount() {
    await this.populateForm();
  }


  validate = () => {
    const result = Joi.validate(this.state.data, this.scheema, {
      abortEarly: false
    });
    if (!result.error) return null;
    const errors = {};
    for (let item of result.error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  };

  validateProperty = inputField => {
    const { name, value } = inputField;
    const obj = { [name]: value };
    const scheema = { [name]: this.scheema[name] };
    const result = Joi.validate(obj, scheema);
    return result.error ? result.error.details[0].message : null;
  };

  handleChange = event => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(event.currentTarget);
    if (errorMessage) errors[event.currentTarget.name] = errorMessage;
    else delete errors[event.currentTarget.name];

    const data = { ...this.state.data };
    data[event.currentTarget.name] = event.currentTarget.value;

    this.setState({ data: data, errors: errors });
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors ? errors : {} });
    if (errors) return;
    await saveLogisticeventdatetime(this.state.data);
    this.props.history.push("/logisticeventdatetimes");
  };

  render() {
    return (
      <div className="content">
        <h1>Logisticeventdatetime Form</h1>
        <form onSubmit={this.handleSubmit}>

          <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                value={this.state.data["date"]}
                onChange={this.handleChange}
                name="date"
                id="date"
                type="text"
                className="form-control"
              />
              {this.state.errors["date"] && <div className="alert alert-danger">{this.state.errors["date"]}</div>}
          </div>

          <div className="form-group">
              <label htmlFor="time">Time</label>
              <input
                value={this.state.data["time"]}
                onChange={this.handleChange}
                name="time"
                id="time"
                type="text"
                className="form-control"
              />
              {this.state.errors["time"] && <div className="alert alert-danger">{this.state.errors["time"]}</div>}
          </div>

          <button disabled={this.validate()} className="btn btn-primary custom-btn">Save</button>

        </form>
      </div>
    );
  }
}

export default createLogisticeventdatetime;