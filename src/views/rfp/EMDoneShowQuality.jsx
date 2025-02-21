import React, { useState, useEffect, useCallback } from 'react';
import { Col, Container, Row} from 'react-bootstrap';
import EMDoneShowQualityTab from '../../table/EMDoneShowQualityTab';

function EMDoneShowQuality() {
    return (
        <div>
          <Container fluid className="my-5">
            <Row>
              <Col lg={2}></Col>
              <Col lg={10}>
                <div className="bgColor rounded-3 shadow">
                  <h4 className="fw-bold py-3 ms-3 text_color">Email Marketing Done Files</h4>
                </div>
               
                <EMDoneShowQualityTab />
              </Col>
            </Row>
          </Container>
        </div>
      );
}

export default EMDoneShowQuality
