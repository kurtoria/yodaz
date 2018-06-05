var React = require("react");
var ReactDOM = require("react-dom");
var {HashRouter, Link, Route} = require("react-router-dom");

class Cities extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      cities: [],
      id: undefined,
      city: undefined,
      population: undefined
    }

    this.onDeleteClick = this.onDeleteClick.bind(this)
    this.onUpdateClick = this.onUpdateClick.bind(this)
    this.onNewCityClick = this.onNewCityClick.bind(this)
    this.onNewCityTextChange = this.onNewCityTextChange.bind(this)
    this.addNewCity = this.addNewCity.bind(this)
  }

  componentDidMount(){
    fetch('http://cities.jonkri.se/')
    .then(response => response.json())
    .then(result => {
      console.log(result);
      this.setState({ cities: result}) })
  }

  onDeleteClick(event) {
    console.log(event.target.dataset.id);
    var inputId = event.target.dataset.id;
    fetch(('http://cities.jonkri.se/' + inputId ) , { method: "DELETE" })
    .then(() => {
      fetch('http://cities.jonkri.se/')
      .then(response => response.json())
      .then(result => {
        console.log(result);
        this.setState({ cities: result}) })
  })
}

onUpdateClick(){
  fetch('http://cities.jonkri.se/' + this.state.id , {
    body: JSON.stringify({ name: this.state.city, population: this.state.population }),
    headers: {
      'Content-Type': 'application/json'
    },
      method: 'PUT'
    })
    this.setState({id: ''});
}

  onNewCityClick() {
    console.log("City is: " + this.state.city);
    console.log("Population is: " + this.state.population);

    if (this.state.city != "" && this.state.population != ""){
      if (this.state.population != 0){
        fetch("http://cities.jonkri.se/", {
          body: JSON.stringify({ "name": this.state.city, "population": this.state.population }),
          headers: {
            "Content-Type": "application/json"
          },
          method: 'POST'
        }).then(() => {
          fetch('http://cities.jonkri.se/')
          .then(response => response.json())
          .then(result => {
            console.log(result);
            this.setState({ cities: result}) })
        })

        alert("You sucessfully added " + this.state.city + " with a population of " + this.state.population + ". Nice!");
        document.getElementById("inputcity").value = "";
        document.getElementById("inputpop").value = "";
      } else {
        alert("The city must have at least one citizen, right?");
      }
    } else {
      alert("You must fill all the fields.");
    }
  }

onNewCityTextChange(event) {
  if (event.target.id == "inputcity") {
    this.setState({city: event.target.value})
  } else {
    this.setState({population: event.target.value})
  }
}

addNewCity() {
  var city = prompt()
  fetch("http://cities.jonkri.se/", {
    body: JSON.stringify({ "name": city, "population": " " }),
    headers: {
      "Content-Type": "application/json"
    },
    method: 'POST'
  }).then(() => {
    fetch('http://cities.jonkri.se/')
    .then(response => response.json())
    .then(result => {
      console.log(result);
      this.setState({ cities: result}) })
  })

}

  render(){
    var citiesToRender = this.state.cities.map(city =>
      this.state.id === city.id ?
    <tr id={city.id} key={city.id} >
      <td>
        <input onChange={function(event){
          city.name = event.target.value
          this.setState({
            id: city.id,
            city: city.name
          })}.bind(this)}
            value={city.name}>
        </input>
      </td>
      <td>
        <input onChange={function(event){
          city.population = event.target.value
          this.setState({
            id: city.id,
            population: event.target.value
          })}.bind(this)}
            value={city.population}>
        </input>
      </td>
      <button type="button" onClick={this.onUpdateClick}>✔️</button>
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
        </tbody>
      </table>
      <button id="addBtn" onClick={this.addNewCity}>➕</button>
      <input id="inputcity" city={this.state.city} onChange={this.onNewCityTextChange}/>
      <input id="inputpop" type="number" population={this.state.population} onChange={this.onNewCityTextChange}/>
      <button onClick={this.onNewCityClick}>ADD CITY!</button>
    </div>
  }
}

class Food extends React.Component {
  render () {
    return  <section><h1>Food</h1><p>...</p></section>
  }
}

// VICTORIA
class Updatecity extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        cities: [],
        id: undefined,
        city: undefined,
        population: undefined,
        newCity: undefined,
        newPopulation: undefined
      }
      this.onClick = this.onClick.bind(this);
    }
    componentDidMount() {
      fetch('http://cities.jonkri.se/')
      .then(function (response) {
        return response.json();
      }).then( result => {
        console.log(result);
        this.setState({
          cities: result
        })
      });
    }
    onChange() {
      fetch('http://cities.jonkri.se/' + this.state.id, {
        body: JSON.stringify({ "name": this.state.newCity, "population": this.state.newPopulation }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PUT'
      }).then(function (response) {
        return response.json();
      }).then( result =>  {
        console.log(result);
      });
    }
    onClick() {
      console.log(this.state.city);
    }
    render() {
      var cities = []
      cities = this.state.cities.map(city =>
        <tr key={city.id}>
        <td>{city.name}</td><td>{city.population}</td>
        {/*<button id="editButton" onClick={this.onClick}>Ändrar</button>*/}
        <button id="editButton" onClick={function() {
          console.log(city.id + ", " + city.name + ", " + city.population);

        }}>Ändrar</button>
        </tr>)
        return <div><table>{cities}</table></div>
    }
}
//Victoria

  ReactDOM.render(<HashRouter>
    <div>
        <nav>
          <ul>
            <li><Link to="/getallcities">Get all Cities</Link></li>
            <li><Link to="/updatecity">Update City</Link></li>
            <li><Link to="/food">Food</Link></li>
        </ul>
      </nav>
    <Route component={Cities} path='/getallcities' />
    <Route component={Updatecity} path='/updatecity' />
    <Route component={Food} path='/food' />
    </div>
  </HashRouter>,
    document.getElementById('app')
  );
