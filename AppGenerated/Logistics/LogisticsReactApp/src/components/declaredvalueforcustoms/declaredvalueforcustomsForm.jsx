import React, { Component } from "react";
import Joi from "joi-browser";
import { saveDeclaredvalueforcustoms, getDeclaredvalueforcustoms } from "../../services/declaredvalueforcustomsService";

class createDeclaredvalueforcustoms extends Component{

 constructor(props){
super(props);
}  state = {
    data: { currencyCode: "", codeListVersion: "", },
    errors: {}
  };

  scheema = {
    _id: Joi.string(),
    currencyCode:  Joi.string()
      .required()


      .label("currencyCode"),
    codeListVersion:  Joi.string()
      .allow('').allow(null)



      .label("codeListVersion"),
    createdAt: Joi.date()
      .label("createAt")
  };

  async populateForm() {
    try {
      const declaredvalueforcustomsId = this.props.match.params.id;
      if(declaredvalueforcustomsId!=="new"){
        const { data } = await getDeclaredvalueforcustoms(declaredvalueforcustomsId);
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
    await saveDeclaredvalueforcustoms(this.state.data);
    this.props.history.push("/declaredvalueforcustomss");
  };

  render() {
    return (
      <div className="content">
        <h1>Declaredvalueforcustoms Form</h1>
        <form onSubmit={this.handleSubmit}>

          <div className="form-group">
              <label htmlFor="currencyCode">Currency Code</label>
              <input
                value={this.state.data["currencyCode"]}
                onChange={this.handleChange}
                name="currencyCode"
                id="currencyCode"
                type="text"
                className="form-control"
              />
              {this.state.errors["currencyCode"] && <div className="alert alert-danger">{this.state.errors["currencyCode"]}</div>}
          </div>

          <div className="form-group">
              <label htmlFor="codeListVersion">Code List Version</label>
              <input
                value={this.state.data["codeListVersion"]}
                onChange={this.handleChange}
                name="codeListVersion"
                id="codeListVersion"
                type="text"
                className="form-control"
              />
              {this.state.errors["codeListVersion"] && <div className="alert alert-danger">{this.state.errors["codeListVersion"]}</div>}
          </div>

          <button disabled={this.validate()} className="btn btn-primary custom-btn">Save</button>

        </form>
      </div>
    );
  }
}

export default createDeclaredvalueforcustoms;