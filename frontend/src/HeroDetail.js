import React, {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import { Row, Col, Carousel, Button, Form, Card } from "react-bootstrap"


function HeroDetail() {
  const { name } = useParams();
  const [hero, setHero] = useState(null);
  const [file, setFile] = useState(null)

  //llamamos al back
  useEffect(()=> {
    fetch(`http://localhost:5000/heroes/${name}`)
      .then((res) => res.json())
      .then((data) => setHero(data))
      .catch((err) => console.error("Error llamada heroes:", err));
  }, [name]);

  if (!hero) return <p>Cargando...</p>;

  // inputs para editar
  const handleChange = (e) => {
    setHero ({...hero, [e.target.name]: e.target.value });
  };

  //guardar cambios
  const handleSave = () => {
    fetch(`http://localhost:5000/heroes/${name}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify(hero),
     })
      .then((res) => res.json())
      .then(data => alert("Heroe actualizado!"));
  };

  //eliminar heroe
  const handleDelete = () => {
    fetch(`http://localhost:5000/heroes/${name}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(data => alert("Heroe eliminado!"));
  };

  //subir imagen
  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", file);

    fetch(`http://localhost:5000/heroes/${name}`, {
        method: "POST",
        body: formData,
    })
        .then((res) => res.json())
        .then(data => {
            alert("Imagen subida!");
            setHero({...hero, images: [...(hero.images || []), data.url] });
        });
  };

  const handleRemoveImage = (index) => {
    const newImages = hero.images.filter((_, i) => i !== index);
    setHero({...hero, images: newImages });

    fetch(`http://localhost:5000/heroes/${hero.superheroName}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({...hero, images: newImages }),
    })
        .then(res => res.json())
        .then(() => alert("Imagen eliminada"));
  };

  return (
    <Card className="p-4">
        <Row>
            <Col md={6}>
                {/* casrrusel*/}
                {hero.images && hero.images.length > 0 && (
                <Carousel className="mb-3">
                    {hero.images.map((img, i) => (
                        <Carousel.Item key={i}>
                            <img src={img} 
                                alt={`Imagen ${i}`} 
                                className="d-block mx-auto" 
                                style={{ width: "50%", height: "auto"}}/>
                            <div className="text-center mt-2">
                                <Button variant="danger" size="sm" onClick={() => handleRemoveImage(i)}>
                                    Eliminar esta imagen
                                </Button>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
                )}
            </Col>
            <Col md={6}>
                <Card.Body>
                    <Card.Title>{hero.superheroName}</Card.Title>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Personaje</Form.Label>
                            <Form.Control
                                name="characterName"
                                value={hero.characterName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Casa</Form.Label>
                            <Form.Select
                                value={hero.house}
                                onChange={(e) => {
                                    const selectedHouse = e.target.value;
                                    setHero({
                                        ...hero,
                                        house: selectedHouse,
                                        houseLogo: selectedHouse === "DC"
                                        ? "/dc.png"
                                        : "/marvel.png"
                                    });
                                }}
                            >
                                <option value='DC'>DC</option>
                                <option value='MARVEL'>marvel</option>
                            </Form.Select>
                         </Form.Group>

                            {hero.houseLogo && (
                                <div style={{ marginTop: "10px" }}>
                                    <img
                                        src={hero.houseLogo}
                                        alt={hero.house}
                                        style={{ height: "60px" }}
                                    />
                                </div>
                            )}

                       
                        <Form.Group className="mb-3">
                            <Form.Label>Anio</Form.Label>
                            <Form.Control
                                name="year"
                                value={hero.year}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Equipo</Form.Label>
                            <Form.Control
                                name="equipament"
                                value={hero.equipament}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Biografia</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="biography"
                                value={hero.biography}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Subir imagen</Form.Label>
                        <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
                    </Form.Group>

                    <Button variant="primary" classname="me-2" onClick={handleUpload}>Subir imagen</Button>
                    <Button variant="success" classname="me-2" onClick={handleSave}>Modificar</Button>
                    <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
                </Card.Body>
            </Col>
        </Row>
        
    </Card>

  );
}

export default HeroDetail;