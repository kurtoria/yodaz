var React = require("react");
var ReactDOM = require("react-dom");
var {HashRouter, Link, Route} = require("react-router-dom");
var {connect, Provider} = require("react-redux");
var Redux = require("redux");

var reducer = function(state, action) {
  switch (action.type) {
    case "ADD_CITY":
      fetch("http://cities.jonkri.se", {
        body: JSON.stringify({
          name: state.name,
          population: state.population
        }),
        headers: {
          "Content-Type": "application/json"
        },
          method: "POST"
        })
        .then(response => response.json())
        .then(result => {
          store.dispatch({
            payload: result,
            type: "SET_CITIES"
          })
        })
      return {
        cities: state.cities,
        id: "",
        name: "",
        population: "",
        newName: "",
        newPopulation: ""
      };
    case "SET_ID":
      return {
        cities: state.cities,
        id: action.payload,
        name: state.name,
        population: state.population,
        newName: action.newName,
        newPopulation: action.newPopulation
      };
    case "SET_NAME":
      return {
        cities: state.cities,
        id: state.id,
        name: action.payload,
        population: state.population,
        newName: state.newName,
        newPopulation: state.newPopulation
      };
    case "SET_POPULATION":
      return {
        cities: state.cities,
        id: state.id,
        name: state.name,
        population: action.payload,
        newName: state.newName,
        newPopulation: state.newPopulation
      };
    case "EDIT_NAME":
      return {
        cities: state.cities,
        id: state.id,
        name: state.name,
        population: state.population,
        newName: action.payload,
        newPopulation: state.newPopulation
      };
    case "EDIT_POPULATION":
      return {
        cities: state.cities,
        id: state.id,
        name: state.name,
        population: state.population,
        newName: state.newName,
        newPopulation: action.payload
      };
    case "SET_CITIES":
      return {
        cities: action.payload,
        id: state.id,
        name: state.name,
        population: state.population,
        newName: state.newName,
        newPopulation: state.newPopulation
      };
    case "DELETE_CITY":
      console.log("Id: " + action.payload);
      fetch("http://cities.jonkri.se/" + action.payload, {
          method: "DELETE"
        })
        .then(() => {
          fetch("http://cities.jonkri.se/")
            .then(response => response.json())
            .then(result => {
              console.log(result);
              store.dispatch({
                payload: result,
                type: "SET_CITIES"
              })
            })
        })
      return {
        cities: state.cities,
        id: "",
        name: "",
        population: "",
        newName: "",
        newPopulation: ""
      };
    case "UPDATE_CITY":
      console.log("ID på update är : " + action.payload)
      fetch("http://cities.jonkri.se/" + action.payload, {
        body: JSON.stringify({
          name: action.payloadName,
          population: action.payloadPopulation
        }),
        headers: {
          "Content-Type": "application/json"
        },
          method: "PUT"
        })
        .then(() => {
          fetch("http://cities.jonkri.se/")
            .then(response => response.json())
            .then(result => {
              console.log(result);
              store.dispatch({
                payload: result,
                type: "SET_CITIES"
              })
            })
        })
      return {
        cities: state.cities,
        id: "",
        name: "",
        population: "",
        newName: "",
        newPopulation: ""
      };
  }
  return state;
};

var store = Redux.createStore(
  reducer, {
    cities: [],
    id: "",
    name: "",
    population: "",
    newName: "",
    newPopulation: ""
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

//Första fetch
fetch("http://cities.jonkri.se/")
  .then(response => response.json())
  .then(result => {
    store.dispatch({
      payload: result,
      type: "SET_CITIES"
    })
  })

class Cities extends React.Component {
    render() {
      var citiesToRender = this.props.cities.map(city =>
        this.props.id === city.id ?
        <tr id={city.id} key={city.id}>
          <td>
            <input onChange = {this.props.editName}
              value = {this.props.newName}/>
          </td>
          <td>
            <input type="number"
              onChange = {this.props.editPopulation}
              value = {this.props.newPopulation}/>
          </td>
          <td>
            <button type="button"
              data-name={city.name}
              data-population={city.population}
              data-id={city.id}
              onClick={event => this.props.updateCity(
                event,
                this.props.newName,
                this.props.newPopulation
              )} >✔️</button>
          </td>
        </tr>
        :
        <tr key={city.id} id={city.id} >
          <td>{city.name}</td>
          <td>{city.population}</td>
          <td>
            <button id="penBtn"
              data-name={city.name}
              data-population={city.population}
              data-id={city.id}
              onClick={event => this.props.setId(
                event
              )}>🖊</button>
            <button id="deleteBtn"
              data-name={city.name}
              data-population={city.population}
              data-id={city.id}
              onClick={this.props.deleteCity}>🗑
            </button>
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
                <td>
                  <input id="inputcity"
                    onChange={this.props.setName}
                    value={this.props.name}/>
                </td>
                <td>
                  <input id="inputpop"
                    type="number"
                    onChange={this.props.setPopulation}
                    value={this.props.population}/>
                </td>
                <td>
                  <button onClick={this.props.addCity}>➕</button>
                </td>
              </tr>
          </tbody>
        </table>
      </div>
    }
  }

    var ConnectedCity = connect(
      function(state) {
        return {
          cities: state.cities,
          id: state.id,
          name: state.name,
          population: state.population,
          newName: state.newName,
          newPopulation: state.newPopulation
        }
      },
      function(dispatch) {
        return {
          addCity: function() {
            return dispatch({
              type: "ADD_CITY"
            })
          },
          setId: function (event) {
            return dispatch({
              payload: event.target.dataset.id,
              newName: event.target.dataset.name,
              newPopulation: event.target.dataset.population,
              type: "SET_ID"
            })
          },
          setName: function(event) {
            return dispatch({
              payload: event.target.value,
              type: "SET_NAME"
            })
          },
          setPopulation: function(event) {
            return dispatch({
              payload: event.target.value,
              type: "SET_POPULATION"
            })
          },
          deleteCity: function(event) {
            console.log("Detta är id: " + event.target.dataset.id);
            return dispatch({
              payload: event.target.dataset.id,
              type: "DELETE_CITY"
            })
          },
          updateCity: function (event, name, population) {
            return dispatch({
              payload: event.target.dataset.id,
              payloadName: name,
              payloadPopulation: population,
              type: "UPDATE_CITY"
            })
          },
          editName: function (event) {
            return dispatch({
              payload: event.target.value,
              type: "EDIT_NAME"
            })
          },
          editPopulation: function(event) {
            return dispatch({
              payload: event.target.value,
              type: "EDIT_POPULATION"
            })
          }
        }
      })(Cities)

    class Jokes extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          joke: undefined,
          punchline: undefined,
          showPunchline: false,
          disabled: true
        }
        this.getJoke = this.getJoke.bind(this)
        this.getPunchline = this.getPunchline.bind(this)
      }

      getJoke() {
        fetch("https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_joke")
          .then(response => response.json())
          .then(result => {
            this.setState({
              joke: result.setup,
              punchline: result.punchline
            })
            this.setState({
              showPunchline: false
            })
            this.setState({
              disabled: false
            })
          })
      }

      getPunchline() {
        this.setState({
          showPunchline: true
        })
        this.setState({
          disabled: true
        })
      }

      render() {
        return <section>
          <div id="imageDiv">
            <img id="bugImage"
              alt="" src="not_a_bug.png"
              onClick={this.getJoke}>
            </img>
            <p>{this.state.joke}</p>
            <input type="button"
              disabled={this.state.disabled}
              value="Get Punchline"
              onClick={this.getPunchline}>
            </input>
            <p>{this.state.showPunchline ? this.state.punchline : null}</p>
            </div>
        </section>
      }
    }

    ReactDOM.render(<Provider store={store}>
      <div>
        <HashRouter>
          <div>
            <div id="topBorder"></div>
            <nav>
              <ul>
                <li id="citiesTab"><Link to="/cities">Cities</Link></li>
                <li id="jokesTab"><Link to="/jokes">Jokes</Link></li>
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
