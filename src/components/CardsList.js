import React from "react"
import axios from "axios"

class CardsList extends React.Component {
  getLogin() {
    axios.get("https://reqres.in/api/users?page=2").then(res => {
      console.log(res)
    })
  }

  constructor(props) {
    super(props)

    this.state = {
      grades: {},
    }
    this.getLogin()
  }

  componentDidMount() {}

  render() {
    return <div>hi</div>
  }
}

export default CardsList

/*
<div className="Cards">
          <h2>Grades:</h2>
          <div className="CardGroup">
            <Card title="One Click Captchas" text="Hey" />
          </div>
        </div>
*/
