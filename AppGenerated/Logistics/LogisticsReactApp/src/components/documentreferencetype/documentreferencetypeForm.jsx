import React, { Component } from "react";
import Joi from "joi-browser";
import { saveDocumentreferencetype, getDocumentreferencetype } from "../../services/documentreferencetypeService";

class createDocumentreferencetype extends Component{

 constructor(props){
super(props);
}  state = {
    data: { id: "", creationDateTime: "", revisionNumber: "", lineItemNumber: "", },
    errors: {}
  };

  scheema = {
    _id: Joi.string(),
    id:  Joi.number()
      .required()


      .label("id"),
    creationDateTime:  Joi.date()
      .allow('').allow(null)



      .label("creationDateTime"),
    revisionNumber:  Joi.number()



      .label("revisionNumber"),
    lineItemNumber:  Joi.number()



      .label("lineItemNumber"),
    createdAt: Joi.date()
      .label("createAt")
  };

  async populateForm() {
    try {
      const documentreferencetypeId = this.props.match.params.id;
      if(documentreferencetypeId!=="new"){
        const { data } = await getDocumentreferencetype(documentreferencetypeId);
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
    await saveDocumentreferencetype(this.state.data);
    this.props.history.push("/documentreferencetypes");
  };

  render() {
    return (
      <div className="content">
        <h1>Documentreferencetype Form</h1>
        <form onSubmit={this.handleSubmit}>

          <div className="form-group">
              <label htmlFor="id">Id</label>
              <input
                value={this.state.data["id"]}
                onChange={this.handleChange}
                name="id"
                id="id"
                type="number"
                className="form-control"
              />
              {this.state.errors["id"] && <div className="alert alert-danger">{this.state.errors["id"]}</div>}
          </div>

          <div className="form-group">
              <label htmlFor="creationDateTime">Creation Date Time</label>
              <input
                value={this.state.data["creationDateTime"].substring(0, 10)}
                onChange={this.handleChange}
                name="creationDateTime"
                id="creationDateTime"
                type="date"
                className="form-control"
              />
              {this.state.errors["creationDateTime"] && <div className="alert alert-danger">{this.state.errors["creationDateTime"]}</div>}
          </div>

          <div className="form-group">
              <label htmlFor="revisionNumber">Revision Number</label>
              <input
                value={this.state.data["revisionNumber"]}
                onChange={this.handleChange}
                name="revisionNumber"
                id="revisionNumber"
                type="number"
                className="form-control"
              />
              {this.state.errors["revisionNumber"] && <div className="alert alert-danger">{this.state.errors["revisionNumber"]}</div>}
          </div>

          <div className="form-group">
              <label htmlFor="lineItemNumber">Line Item Number</label>
              <input
                value={this.state.data["lineItemNumber"]}
                onChange={this.handleChange}
                name="lineItemNumber"
                id="lineItemNumber"
                type="number"
                className="form-control"
              />
              {this.state.errors["lineItemNumber"] && <div className="alert alert-danger">{this.state.errors["lineItemNumber"]}</div>}
          </div>

          <button disabled={this.validate()} className="btn btn-primary custom-btn">Save</button>

        </form>
      </div>
    );
  }
}

export default createDocumentreferencetype;