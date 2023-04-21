import { useContext, useEffect, useState } from "react";
import Brewery from "../model/Brewery";
import {
  Button,
  Card,
  CardBody,
  CardDeck,
  CardSubtitle,
  CardText,
  CardTitle,
} from "reactstrap";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FavoritesContextModel } from "../context/FavoritesContextModel";
import FavoritesContext from "../context/FavoritesContext";
import { fetchFavoritesByUserId } from "../services/favoritesservice";

export interface IBreweryItemProps {
  brewery : Brewery;
}

export function BreweryItem(props: IBreweryItemProps) {
  const { brewery } = props;

  const [isFavorite, setFavorite] = useState<boolean>(false);

  const { favorites, addFavorite, deleteFavorite } = useContext<FavoritesContextModel>(FavoritesContext);

  const { user } = useContext(AuthContext);
  const uid = user?.uid || null;


  useEffect(() => {
    const getFavorites = async () => {
      const fetchedFavorites = await fetchFavoritesByUserId(uid!);
      const favorite = fetchedFavorites.find((fav) => fav.breweryId === brewery.id);
      setFavorite(!!favorite);
    };
    if (uid) {
      getFavorites();
    }
  }, [uid, brewery.id]);

  const addFavoriteHandler = () => {
    if (uid) {
      const newFavorite = { uid, breweryId: brewery.id, brewery };
      addFavorite(newFavorite);
      setFavorite(true);
    }
  };

  const removeFavoriteHandler = () => {
    if (uid) {
      const favorite = favorites.find((fav) => fav.breweryId === brewery.id && fav.uid === uid);
      if (favorite) {
        deleteFavorite(favorite._id!);
        setFavorite(false);
      }
    }
  };

  const button = isFavorite ? (
    <Button
      className="Starbutton"
      style={{ padding: 2 }}
      onClick={removeFavoriteHandler}
    >
      <img src="/beer.avif" style={{height: "30px", width: "30px", backgroundColor:"" }}
        alt="not favorite"
      />
      
    </Button>
  ) : (
    <Button
      className="StarbuttonEmpty"
      style={{ padding: 2 }}
      onClick={addFavoriteHandler}
    > <img src="/beerfill.png" style={{height: "30px", width: "30px", backgroundColor:"" }}
        alt="favorite"
      />
        
    </Button>
  );

  return (
    <CardDeck className="wholeCard">
      <Card  className="cardStyle" style={{ height: "220px" }}>
        <CardBody>
          <CardTitle className="CardText" tag="h5">{brewery.name}</CardTitle>
          <CardSubtitle className="CardText">
           <b>Location:</b> {brewery.city}, {brewery.state}
          </CardSubtitle>
          <CardText className="CardText"><b>Type:</b> {brewery.brewery_type}</CardText>
          <Link to={`/reviews/${brewery.id}?name=${brewery.name}`}><button className="CardReviews">Reviews</button></Link>
      <Link to={`/brewerydetail/${brewery.id}`}><button className="CardDetails">Details</button></Link>
      {button}
        </CardBody>
      </Card>
    </CardDeck>
  );
}
