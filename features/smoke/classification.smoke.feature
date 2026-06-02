@smoke
Feature: Document Classification — Smoke

  Background:
    Given the Kafka consumer is ready

  Scenario: Single document single classification
    Given the file "single_doc.pdf" with shareId "share-001" is uploaded with classifications "PASSPORT"
    When all classification messages are received
    Then the classifications should contain "PASSPORT"

  Scenario: Single document multiple classifications
    Given the file "multi_doc.pdf" with shareId "share-002" is uploaded with classifications "PASSPORT,DRIVING_LICENCE,PAYSLIP"
    When all classification messages are received
    Then the classifications should contain "PASSPORT,DRIVING_LICENCE,PAYSLIP"