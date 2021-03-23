import React, { Component } from "react";
import Joi from "joi-browser";
import { saveScope, getScope } from "../../services/scopeService";

class createScope extends Component{

 constructor(props){
super(props);
}  state = {
    data: { Type: "", InstanceIdentifier: "", Identifier: "", },
    errors: {}
  };

  scheema = {
    _id: Joi.string(),
    Type:  Joi.string()
      .required()


      .label("Type"),
    InstanceIdentifier:  Joi.string()
      .required()


      .label("InstanceIdentifier"),
    Identifier:  Joi.string()
      .allow('').allow(null)



      .label("Identifier"),
    createdAt: Joi.date()
      .label("createAt")
  };

  async populateForm() {
    try {
      const scopeId = this.props.match.params.id;
      if(scopeId!=="new"){
        const { data } = await getScope(scopeId);
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
    await saveScope(this.state.data);
    this.props.history.push("/scopes");
  };

  render() {
    return (
      <div className="content">
        <h1>Scope Form</h1>
        <form onSubmit={this.handleSubmit}>

          <div className="form-group">
              <label htmlFor="Type"> Type</label>
              <input
                value={this.state.data["Type"]}
                onChange={this.handleChange}
                name="Type"
                id="Type"
                type="text"
                className="form-control"
              />
              {this.state.errors["Type"] && <div className="alert alert-danger">{this.state.errors["Type"]}</div>}
          </div>

          <div className="form-group">
              <label htmlFor="InstanceIdentifier"> Instance Identifier</label>
              <input
                value={this.state.data["InstanceIdentifier"]}
                onChange={this.handleChange}
                name="InstanceIdentifier"
                id="InstanceIdentifier"
                type="text"
                className="form-control"
              />
              {this.state.errors["InstanceIdentifier"] && <div className="alert alert-danger">{this.state.errors["InstanceIdentifier"]}</div>}
          </div>

          <div className="form-group">
              <label htmlFor="Identifier"> Identifier</label>
              <input
                value={this.state.data["Identifier"]}
                onChange={this.handleChange}
                name="Identifier"
                id="Identifier"
                type="text"
                className="form-control"
              />
              {this.state.errors["Identifier"] && <div className="alert alert-danger">{this.state.errors["Identifier"]}</div>}
          </div>

          <button disabled={this.validate()} className="btn btn-primary custom-btn">Save</button>

        </form>
      </div>
    );
  }
}

export default createScope;