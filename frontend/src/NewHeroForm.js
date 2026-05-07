import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Row, Col, Carousel, Button, Form, Card } from "react-bootstrap"

function NewHeroForm () {
    const [hero, setHero] = useState({
        superheroName: "",
        characterName: "",
        house: "",
        year: "",
        equipament: "",
        biography: "",
        images: [],
        houseLogo:""
    });
    const [file, setFile] = useState(null)

    const handleChange = (e) => {
        setHero({ ...hero,[e.target.name]: e.target.value });
    };

     const handleImageUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const imageUrl = URL.createObjectURL(selectedFile);
            setHero({ ...hero, images: [ ...hero.images, imageUrl]});
            setFile(selectedFile);
        }
    };

    const handleRemoveImage = (index) => {
        const updatedImages = hero.images.filter((_, i) => i !== index);
        setHero({ ...hero, images: updatedImages });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/heroes", {
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify(hero)
        })
            .then(() => alert("Hero agregado!"));
    };

    return (
       <div className="p-4">
            <h2>Nuevo Heroe</h2>
            <Row>
                <Col md={6}>
                    {/* casrrusel */}
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
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Superhero nombre</Form.Label>
                            <Form.Control
                                name="superheroName"
                                value={hero.superheroName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Character nombre</Form.Label>
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
                                        houseLogo:
                                            selectedHouse === "DC"
                                            ? "/dc.png"
                                            : "/marvel.png"
                                    });
                                }}
                            >
                                <option value=''>Seleccionar...</option>
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
                   
                        <Form.Group className="mb-3">
                            <Form.Label>Subir imagen</Form.Label>
                            <Form.Control type="file" onChange={handleImageUpload} />
                        </Form.Group>

                        <Button variant="success" type="submit">Guardar</Button>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default NewHeroForm;