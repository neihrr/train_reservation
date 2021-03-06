import React from 'react';
import '../styles/AdminPanel.css';
import { Typography,Button,Row,Col,Modal,Table, Tag, Space} from 'antd';
import {Icon, DollarOutlined} from '@ant-design/icons';
import axios from 'axios';
const { Title, Paragraph, Text, Link } = Typography;


class AdminPanel extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            items: null,
            revenue:0,
            data:null,
            carValues:["A","B","C","D","E","F","G","H","I","J","K","L"],
            dom:null,
            reservations:null,
            isModalVisible:false,
            reservationTableData:null,
        }

        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.deletion=this.deletion.bind(this);

    }
   

    showModal(carValueIndex){
        let carReservations = [];
        this.setState({isModalVisible:true});
        this.state.reservations.some(e => {
            if(e.carInfo == this.state.carValues[carValueIndex]){
                carReservations.push({reservationId : e.reservationId, name:e.firstName, last_name:e.lastName, car_info:e.carInfo, seat_info: e.seatInfo, departure:e.departure, arrival:e.arrival ,ticket_price:"$"+e.cost})
            }});
        
        this.setState({reservationTableData:carReservations});
        
    }
    handleOk(){
        this.setState({isModalVisible:false});
    
    }
    deletion(id){
        axios.delete("http://localhost:3001/reservation/"+id);
    }

    async componentDidMount(){
        const cars = [];
        await axios.get("http://localhost:3001/reservation/").then(
            res=>{
                const reservations = res.data;
                this.setState({reservations:reservations});
                console.log(reservations);
                
            }
            
            )

        await axios.get("http://localhost:3001/reservation/revenue").then(
            res=>{
                const revenue = res.data;
                this.setState({revenue:revenue})
                console.log(revenue);
            }
            )

        if(this.state.reservations !== undefined && this.state.reservations !== null && this.state.reservations.length > 0){
            this.state.reservations.forEach(reservation=>{
                if(cars.includes(reservation.carInfo) !== true){
                    cars.push(reservation.carInfo);
                }
                
                })
        }  
        console.log(cars);

        let carStatus = [];

        for(let i = 0; i<this.state.carValues.length; i++){
            if(cars.includes(this.state.carValues[i])){
                carStatus[i] = true;
                continue;
            }
            carStatus[i] = false;
        }
        console.log(carStatus);

        const cols = [];
        const rows = [];
 

        for (let i=0; i<12; i++){
            console.log(carStatus[i]);
            if(carStatus[i] == true){
                cols.push(
                    <Col key = {i} className="gutter-row-admin" span={6}>
                        <div className="car-container-first-admin" style={this.style}>
                            <Link to="/PopUp">
                            <Button type="primary" onClick={()=>{this.showModal(i)}}>{this.state.carValues[i]}</Button>
                            {console.log(this.state.isModalVisible)}
                           
                            </Link>
                        </div>
                    </Col>
                );
            }
            if(carStatus[i] == false){
                cols.push(
                    <Col key = {i} className="gutter-row-admin" span={6}>
                    <div className="car-container-admin" style={this.style}>
                        <Link to="/PopUp">
                        <Button type="primary" onClick={()=>{this.showModal(i)}} disabled>{this.state.carValues[i]}</Button>
                      
                        </Link>
                    </div>
                </Col>);

            }
        }

        for(let row=0; row<12;){
            rows.push(
                <Row  className="outer-row-admin" classgutter={16}>
                    {cols[row++]}
                    {cols[row++]}
                    {cols[row++]}
                    {cols[row++]}
                </Row>
            )
        }
        
        this.setState({dom: rows});
        
        console.log(this.state.dom);
        
    }


    render(){
        const columns = [
            {
              title: 'name',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'last_name',
              dataIndex: 'last_name',
              key: 'last_name',
            },
            {
              title: 'car_info',
              key: 'car_info',
              dataIndex: 'car_info',
            },
            {
              title: 'seat_info',
              key: 'seat_info',
              dataIndex: 'seat_info',
            },
            {
                title: 'departure',
                key: 'departure',
                dataIndex: 'departure',
              },
              {
                title: 'arrival',
                key: 'arrival',
                dataIndex: 'arrival',
              },
              {
                title: 'ticket_price',
                key: 'ticket_price',
                dataIndex: 'ticket_price',
              },
              
              {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                  <Space size="middle">
                    <Button type="primary" onClick={()=>this.deletion(record.reservationId)}>Cancel</Button>
                  </Space>
                ),
            },
          ];
          
        return(
            <>
                <div className='brand-nav-admin'>RAIL-AWAY</div>
                
                <h1 className="context-admin"> WELCOME ADMIN</h1>
                <div className="container_div-admin">
                    {this.state.dom}
                    <Modal title="RESERVATION INFORMATION" 
                    className="popup-modal" 
                    visible={this.state.isModalVisible} 
                    closeIcon={<></>}
                    footer = {[
                    <Button key="ok" type="primary" onClick={()=>this.handleOk()}>
                    OK
                    </Button>,]}>
                        <Table columns={columns} dataSource={this.state.reservationTableData}/>
                    </Modal>
                </div>
                <div className='revenue-bar'><DollarOutlined /><DollarOutlined /><DollarOutlined />Total Revenue: ${this.state.revenue}</div>
                <div className="brand-footer-admin">@ 2022 RAIL-AWAY - All Rights reserved.</div>

            </>
            
           
        );
    }
}
export default AdminPanel;