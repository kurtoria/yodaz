var React = require("react");
var ReactDOM = require("react-dom");
var {HashRouter, NavLink, Route} = require("react-router-dom");
var {connect, Provider} = require("react-redux");
var Redux = require("redux");
var moment = require("moment");
var axios = require("axios")

// Spread syntax
// Checkar om state är undefined, så får den detta värde, annars får den värden som sätts, som en if (state == undefined)
var reducer = function(state = {
  cities: [],
  id: "",
  name: "",
  population: "",
  newName: "",
  newPopulation: "",
  pokeName: "Pokemon",
  pokePic: "",
  pokeType: "",
  pokeShinyPic: "",
  pokeNr: ""
  },
  action) {
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
      ...state,
      id: "",
      name: "",
      population: "",
      newName: "",
      newPopulation: ""
    };
    case "SET_ID":
    return {
      ...state,
      id: action.payload,
      newName: action.newName,
      newPopulation: action.newPopulation
    };
    case "SET_NAME":
    return {
      ...state,
      name: action.payload
    };
    case "SET_POPULATION":
    return {
      ...state,
      population: action.payload
    };
    case "EDIT_NAME":
    return {
      ...state,
      newName: action.payload
    };
    case "EDIT_POPULATION":
    return {
      ...state,
      newPopulation: action.payload
    };
    case "SET_CITIES":
    return {
      ...state,
      cities: action.payload
    };
    case "DELETE_CITY":
    fetch("http://cities.jonkri.se/" + action.payload, {
      method: "DELETE"
    })
    .then(() => {
      fetch("http://cities.jonkri.se/")
      .then(response => response.json())
      .then(result => {
        store.dispatch({
          payload: result,
          type: "SET_CITIES"
        })
      })
    })
    return {
      ...state,
      id: "",
      name: "",
      population: "",
      newName: "",
      newPopulation: ""
    };
    case "UPDATE_CITY":
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
      store.dispatch({
        payload: result,
        type: "SET_CITIES"
      })
    })
  })
  return {
    ...state,
    id: "",
    name: "",
    population: "",
    newName: "",
    newPopulation: ""
  };
  case "FETCH_POKEMON":
  fetch('https://pokeapi.co/api/v2/pokemon/' + state.pokeNr + '/')
  .then(response => response.json())
  .then(result => {
    store.dispatch({
      payload: result,
      nr: state.pokeNr,
      type: "SET_POKEMON"
    })
  })
  return {
    ...state,
    pokeNr: action.payload
  }
  case "SET_POKEMONNR":
  return {
    ...state,
    pokeNr: action.payload
  }
  case "SET_POKEMON":
    var types = [];
    for (var i = 0; i < action.payload.types.length; i++) {
      types.push(action.payload.types[i].type.name)
    }
    var typestring = types.join(", ");
    return {
      ...state,
      pokeName: action.payload.forms[0].name,
      pokePic: action.payload.sprites.front_default,
      pokeType: "Type: " + typestring,
      pokeShinyPic: action.payload.sprites.front_shiny,
      pokeNr: action.nr
    }
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
    newPopulation: "",
    pokeName: "Pokemon",
    pokePic: "",
    pokeType: "",
    pokeShinyPic: "",
    pokeNr: ""
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

axios.get("http://cities.jonkri.se/")
.then(function(response) {
  store.dispatch({
    payload: response.data,
    type: "SET_CITIES"
  })
})
.catch(function(error) {
  console.log("Error: " + error)
})


class Cities extends React.Component {
  render() {
    var citiesToRender = this.props.cities.map(city =>
      this.props.id === city.id ?
      <tr id={city.id} key={city.id}>
        <td>
          <input className="input" onChange = {this.props.editName}
          value = {this.props.newName}/>
        </td>
        <td>
          <input className="input"
            type="number"
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
            )} >✔️
          </button>
        </td>
      </tr>
      :
      <tr key={city.id} id={city.id}>
        <td>{city.name}</td>
        <td>{city.population}</td>
        <td>
          <button id="penBtn"
            data-name={city.name}
            data-population={city.population}
            data-id={city.id}
            onClick={event => this.props.setId(event)}>🖊
          </button>
          <button id="deleteBtn"
            data-name={city.name}
            data-population={city.population}
            data-id={city.id}
            onClick={this.props.deleteCity}>🗑
          </button>
        </td>
      </tr>
    )
    if (this.props.match.isExact == true) {
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
                <input className="input"
                  onChange={this.props.setName}
                  value={this.props.name}/>
              </td>
              <td>
                <input className="input"
                  type="number"
                  onChange={this.props.setPopulation}
                  value={this.props.population}/>
              </td>
              <td>
                <button
                  onClick={this.props.addCity}>➕
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p id="date"> Last updated {moment().format('LLLL')} </p>
      </div>
    } else {
      return null
    }
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
  }
)(Cities)

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
        <input id="getPunchlineBtn"
          type="button"
          disabled={this.state.disabled}
          value="Get Punchline"
          onClick={this.getPunchline}>
        </input>
        <p>{this.state.showPunchline ? (this.state.punchline.toUpperCase()) : null}</p>
      </div>
    </section>
  }
}

class Pokemon extends React.Component {
  render() {
    var isDisabled
    return <section id="pokeSection">
      <h1>{(this.props.pokeName.toUpperCase())}</h1>
      <div>
        <img alt="" src={this.props.pokePic}/>
        <img alt="" src={this.props.pokeShinyPic}/>
      </div>
      <p>{this.props.pokeType}</p>
      <input type="number" onChange={this.props.setPokemonNr}/>
      {(this.props.pokeNr > 0) ? isDisabled = false : isDisabled = true}
      <button onClick={this.props.fetchPokemon} disabled={isDisabled}>SEARCH!</button>
      </section>;
    }
}

var ConnectedPokemon = connect(
  function(state) {
    return {
      pokeName: state.pokeName,
      pokePic: state.pokePic,
      pokeType: state.pokeType,
      pokeShinyPic: state.pokeShinyPic,
      pokeNr: state.pokeNr
    }
  },
  function(dispatch) {
    return {
      fetchPokemon: function() {
        return dispatch({
          type: "FETCH_POKEMON"
        })
      },
      setPokemonNr: function(event) {
        return dispatch({
          payload: event.target.value,
          type: "SET_POKEMONNR"
        })
      }
    }
  }
)(Pokemon)

ReactDOM.render(<Provider store={store}>
  <div>
    <HashRouter>
      <div>
        <div id="topBorder">
          <img id="yodazHeader"src={"yodaz_header_white.png"} alt={""}></img>
        </div>
        <nav>
          <ul className="flexContatiner">
            <li className="tabs">
              <NavLink activeClassName="active" to="/" exact>Cities</NavLink>
            </li>
            <li className="tabs">
              <NavLink activeClassName="active" to="/jokes" exact>Jokes</NavLink>
            </li>
            <li className="tabs">
              <NavLink activeClassName="active" to="/pokemon" exact>Pokémon</NavLink>
            </li>
          </ul>
        </nav>
        <Route component={ConnectedCity} path="/"/>
        <Route component={Jokes} path="/jokes"/>
        <Route component={ConnectedPokemon} path="/pokemon"/>
      </div>
    </HashRouter>
  </div>
</Provider>,
document.getElementById("app")
);
