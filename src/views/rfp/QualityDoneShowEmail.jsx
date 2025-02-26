import React, { useState, useEffect, useCallback } from 'react';
import { Col, Container, Row} from 'react-bootstrap';
import QualityDoneShowEmailTab from '../../table/QualityDoneShowEmailTab';

function QualityDoneShowEmail() {
    return (
        <div>
          <Container fluid className="my-5">
            <Row>
              <Col lg={3}></Col>
              <Col lg={8}>
                <div className="bgColor rounded-3 shadow">
                  <h4 className="fw-bold py-3 ms-3 text_color">Quality Done Files</h4>
                </div>
               
                <QualityDoneShowEmailTab />
              </Col>
            </Row>
          </Container>
        </div>
      );
}

export default QualityDoneShowEmail
