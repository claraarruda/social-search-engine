import React, { useState } from "react";
import ky from "ky";
import queryString from "query-string";
import {
  Button,
  Dropdown,
  Icon,
  Grid,
  Segment,
  Divider,
  Message,
} from "semantic-ui-react";
import PropTypes from "prop-types";
import firebase from "../../utils/firebase";

import "./styles.css";

import SearchResult from "../SearchResult";

const dropdownOptions = [
  {
    text: "Instagram",
    value: "instagram",
  },
  {
    text: "TikTok",
    value: "tiktok",
  },
  {
    text: "Twitter",
    value: "twitter",
  },
  {
    text: "Youtube",
    value: "youtube",
  },
];

const Search = (props) => {
  const [social, setSocial] = useState(null);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { plan } = props;

  const onSocialChangeHandler = (event, { value }) => {
    setSocial(value);
    setResult(null);
  };

  const onSubmitHandler = async () => {
    setIsLoading(true);
    setIsFavorite(false);
    try {
      const response = await ky
        .get(`${process.env.REACT_APP_SERVER_URL}/api/v1/profiles`, {
          searchParams: queryString.stringify({
            social,
            search: query,
            is_premium: plan === "pro",
          }),
          timeout: 25000,
        })
        .json();

      await firebase.addSearch({ query, social });
      setIsLoading(false);
      setResult(response.data);
    } catch (error) {
      setIsLoading(false);
      console.log(error.message);
    }
  };

  const addFavoriteHandler = async () => {
    try {
      await firebase.addFavoriteSearch({ query, social });
      setIsFavorite(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="main-container">
      <Grid columns={1} padded stackable>
        <Grid.Row centered>
          <Grid.Column width={15}>
            <Segment raised>
              <h3 className="title-header">
                <Icon name="angle right" />
                Pesquisar
              </h3>
              <Divider />
              <div id="search-navigation">
                <div className="ui search" style={{ marginRight: "20px" }}>
                  <div className="ui icon input" style={{ width: "500px" }}>
                    <input
                      className="prompt"
                      type="text"
                      placeholder="Palavras-chave"
                      onChange={(event) => {
                        setQuery(event.target.value);
                      }}
                    />
                    <i className="search icon"></i>
                  </div>
                  <div className="results"></div>
                </div>

                <Dropdown
                  placeholder="Escolha a rede social"
                  selection
                  options={dropdownOptions}
                  value={social}
                  onChange={onSocialChangeHandler}
                  style={{ marginRight: "30px" }}
                />

                <Button
                  primary
                  onClick={onSubmitHandler}
                  disabled={social === null || query.length === 0 || isLoading}
                  style={{ marginRight: "30px" }}
                >
                  Buscar
                </Button>
                {plan === "pro" && (
                  <Button
                    onClick={addFavoriteHandler}
                    color="red"
                    disabled={
                      social === null ||
                      query.length === 0 ||
                      result === null ||
                      result.length === 0 ||
                      isFavorite ||
                      isLoading
                    }
                    style={{ marginRight: "30px" }}
                  >
                    <Icon name="heart" />
                    <span>Favoritar</span>
                  </Button>
                )}
              </div>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          {!isLoading ? (
            result !== null && result.length !== 0 ? (
              <SearchResult data={result} social={social} />
            ) : (
              <Message
                info
                hidden={result === null}
                style={{ width: "92%", margin: "0 4%" }}
              >
                <Message.Header>
                  Não há resultados para a sua busca
                </Message.Header>
                <p>Tente novamente depois ou tente outras palavras chave!</p>
              </Message>
            )
          ) : (
            <Message
              style={{ width: "92%", margin: "0 4%", textAlign: "center" }}
            >
              <Message.Content>
                <Icon name="circle notched" loading size="large" />
                <Message.Header style={{ marginTop: "10px" }}>
                  Buscando
                </Message.Header>
              </Message.Content>
            </Message>
          )}
        </Grid.Row>
      </Grid>
    </div>
  );
};

Search.propTypes = {
  plan: PropTypes.string,
};

export default Search;
