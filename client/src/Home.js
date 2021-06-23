import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import CarCard from './components/CarCard'
import { getCarList } from './components/Function'

const Home = () => {
    const [CarList, setCarList] = useState([])

    useEffect(() => {
        getCarList().then(res=>{
            setCarList(res)
        })
    }, [])
    return (
        <Container className="my-5 pt-5">
            <Row className="justify-content-center justify-content-md-start">   
                    {CarList.map((item,index)=><Col xs={9} sm={8} md={6} lg={4} key={index}>
                            <CarCard data={item}/>
                        </Col>
                    )}
            </Row>
        </Container>
    )
}

export default Home
