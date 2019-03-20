import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import Card from "../components/Card"
import CardsList from "../components/CardsList"

const IndexPage = () => (
  <Layout>
    {/* <div className="Cards">
      <h2>Grades:</h2>
      <div className="CardGroup">
        <Card title="One Click Captchas" text="Hey" />
      </div>
    </div> */}
    <CardsList />
  </Layout>
)

export default IndexPage
