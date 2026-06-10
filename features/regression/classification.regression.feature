@regression
Feature: Document Classification — Regression

  Background:
    Given the Kafka consumer is ready

  Scenario Outline: Document is correctly classified
    Given the document with shareId "<shareId>" is uploaded with classifications "<expectedClassifications>"
    When all classification messages are received within <waitSeconds> seconds
    Then the classifications should contain "<expectedClassifications>"

    Examples:
      | testCase         | shareId                              | expectedClassifications    | waitSeconds |
      | single_passport  | 020552bd-3cd7-4bc7-8a41-c64476b85973 | Reisepass                  | 30          |
      | multi_doc_client | 131663ce-4de8-5cd8-9b52-d75587c96084 | Reisepass,Lohnausweis      | 120         |