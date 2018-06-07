var React = require("react");
var ReactDOM = require("react-dom");
var {HashRouter, Link, Route} = require("react-router-dom");
var {connect, Provider} = require("react-redux");
var Redux = require("redux");

var reducer = function (state, action) {
  switch (action.type) {
    case "ADD_CITY":
      fetch('http://cities.jonkri.se', {
        body: JSON.stringify({ name: state.name, population: state.population }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      })
      .then(response => response.json())
      .then(result => {
        console.log("HÄR ÄR STÄDER :)))");
        store.dispatch({ payload: result, type: 'SET_CITIES' })
    })
    return { cities: state.cities, name: '', population: '' }
    case "SET_NAME":
      return {
        cities: state.cities,
        name: action.payload,
        population: state.population
      }
      case "SET_POPULATION":
      return {
        cities: state.cities,
        name: state.name,
        population: action.payload
      }
      case "SET_CITIES":
      return {
        cities: action.payload,
        name: state.name,
        population: state.population
      };
    }
    return state;
  };

var store = Redux.createStore (
  reducer,
  {cities: [], name: "", population: ""},
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


//Första fetch
fetch("http://cities.jonkri.se/")
.then(response => response.json())
.then(result => {
  store.dispatch({payload:result, type: "SET_CITIES"})
})



class Cities extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      cities: [],
      id: undefined,
      city: undefined,
      population: undefined
    };
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onUpdateClick = this.onUpdateClick.bind(this);
  }

  componentDidMount(){
    fetch("http://cities.jonkri.se/")
    .then(response => response.json())
    .then(result => {
      console.log(result);
      this.setState({cities:result})});

  }

  onDeleteClick(event) {
    console.log(event.target.dataset.id);
    var inputId = event.target.dataset.id;
    fetch(("http://cities.jonkri.se/" + inputId ) , { method: "DELETE" })
    .then(() => {
      fetch("http://cities.jonkri.se/")
      .then(response => response.json())
      .then(result => {
        console.log(result);
        this.setState({cities: result})})
  });
}

onUpdateClick(){
  fetch("http://cities.jonkri.se/" + this.state.id , {
    body: JSON.stringify({ name: this.state.city, population: this.state.population }),
    headers: {
      "Content-Type": "application/json"
    },
      method: "PUT"
    });
    this.setState({id: ""});
}
/*
  onAddClick() {
    console.log("City is: " + this.state.city);
    console.log("Population is: " + this.state.population);

    if (this.state.city != "" && this.state.population != ""){
      if (this.state.population != 0){
        fetch("http://cities.jonkri.se/", {
          body: JSON.stringify({ "name": this.state.city, "population": this.state.population }),
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST"
        }).then(() => {
          fetch("http://cities.jonkri.se/")
          .then(response => response.json())
          .then(result => {
            console.log(result);
            this.setState({cities: result})})
        });
        document.getElementById("inputcity").value = "";
        document.getElementById("inputpop").value = "";
      }
    }
  }

onAddTextChange(event) {

  if (event.target.id == "inputcity") {
    this.setState({city: event.target.value});
  } else {
    this.setState({population: event.target.value});
  }
}

*/

  render(){
    var citiesToRender = this.props.cities.map(city =>
      this.state.id === city.id ?
    <tr id={city.id} key={city.id}>
      <td>
        <input onChange = {function(event) {
          city.name = event.target.value
          this.setState({
            id: city.id,
            city: city.name
          })}.bind(this)}
            value = {city.name}>
        </input>
      </td>
      <td>
        <input type="number" onChange = {function(event){
          city.population = event.target.value
          this.setState({
            id: city.id,
            population: event.target.value
          })}.bind(this)}
            value = {city.population}>
        </input>
        <button type="button" onClick={this.onUpdateClick}>✔️</button>
      </td>

    </tr>
    :
      <tr key={city.id} id={city.id} >
        <td>{city.name}</td>
        <td>{city.population}</td>
        <td>
          <button id="penBtn" data-name={city.name} data-population={city.population} data-id={city.id} onClick={function(){
            this.setState({
              id: city.id
            })}.bind(this)}>🖊</button>
          <button id="deleteBtn" data-name={city.name} data-population={city.population} data-id={city.id}  onClick={this.onDeleteClick}>🗑</button>
        </td>
      </tr>)

    return <div>
      <table>
        <thead>
          <tr>
            <th>Stad</th>
            <th>Antal</th>
            <th>Ändra</th>
          </tr>
        </thead>
        <tbody>
          {citiesToRender}
            <tr>
              <th>
                <input id="inputcity" onChange={this.props.setName} value={this.props.name}/>

              </th>
              <th>
                <input id="inputpop" type="number" onChange={this.props.setPopulation} value={this.props.population}/>
              </th>
            <th>
              <button onClick={this.props.addCity}>➕</button>
            </th>
            </tr>
        </tbody>
      </table>
    </div>
  }
}


var ConnectedCity = connect(
  function (state) {
    return {
      cities: state.cities,
      name: state.name,
      population: state.population
    }
  },
  function (dispatch) {
    return {
      addCity: function () {
        return dispatch({
          type: "ADD_CITY"
        })
      },
      setName: function (event) {
        return dispatch({
          payload: event.target.value,
          type: "SET_NAME"
        })
      },
      setPopulation: function (event) {
        return dispatch({
          payload: event.target.value,
          type: "SET_POPULATION"
        })
      }
    }
  })(Cities)

class Jokes extends React.Component {
  render () {
    return <section>
      <h1>Jokes</h1>
      <p>...</p>
    </section>
  }
}

  ReactDOM.render(<Provider store={store}>
    <div>
      <HashRouter>
        <div>
          <nav>
          <ul>
            <li><Link to="/cities">Cities</Link></li>
            <li><Link to="/jokes">Jokes</Link></li>
          </ul>
        </nav>


          <Route component={ConnectedCity} path="/cities"/>
        <Route component={Jokes} path="/jokes"/>
      </div>
    </HashRouter>
  </div>
        </Provider>,
    document.getElementById("app")
  );
