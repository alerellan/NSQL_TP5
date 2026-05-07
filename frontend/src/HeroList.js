import React, {useEffect, useState} from 'react';
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardTitle } from "react-bootstrap"


function HeroList({ filter }) {
  const [heroes, setHeroes] = useState([]);

  //llamamos al back
  useEffect(()=> {
    fetch("http://localhost:5000/heroes")
      .then((res) => res.json())
      .then(data => {
        if (filter === "all") {
            setHeroes(data);
        } else {
            setHeroes(data.filter(hero => hero.house === filter));
        }
      });
  }, [filter]);

  return (
    <div className="container mt-4 d-flex flex-wrap gap-3">

        {heroes.map(hero => (
            <Card key={hero.superheroName} style={{ width: "18rem" }}>

                {hero.images && hero.images.length > 0 && (
                    <Card.Img
                        variant='top'
                        src={hero.images[0]}
                        style={{ height: "200px", ObjectFit: "cover "}}
                    />
                )}
                <CardBody>
                    <CardTitle>{hero.superheroName}</CardTitle>
                    <Card.Subtitle className="mb-2 text-muted">{hero.characterName}</Card.Subtitle>
                    <Card.Text>
                        anio: {hero.year}
                    </Card.Text>
                    {hero.houseLogo && (
                        <div style={{ textAlign: "center", marginBotton: "10px" }}>
                            <img 
                                src={hero.houseLogo}
                                alt={hero.hose}
                                style={{ height: "50px"}}
                            />
                        </div>
                    )}
                    <div style={{ textAlign: "center", marginTop: "10px" }} >
                        <Button variant='primary' as={Link} to={`/heroes/${hero.superheroName}`}>
                        Ver detalle
                        </Button>
                    </div>
                </CardBody>
            </Card>
        ))}
    </div>
  );
}

export default HeroList;