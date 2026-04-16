Feature: Registration
  As a new user,
  I want to register as a Member
  So that I can vote on posts, ask questions, and earn points for discounts.

  # Success scenarios
  Scenario: Successful registration with marketing emails accepted
		Given I am a new user
		When I register with valid account details accepting marketing emails
		Then I should be granted access to my account
		And I should expect to receive marketing emails

  Scenario: Successful registration without marketing emails accepted
    Given I am a new user
		When I register with valid account details declining marketing emails
		Then I should be granted access to my account

  # Failure scenarios
  Scenario: Invalid or missing registration details
    Given I am a new user
    When I register with invalid account details
    Then I should see an error notifying me that my input is invalid
    And I should not have been sent access to account details

  Scenario: Account already created with email
    Given a set of users already created accounts
      | firstName | lastName | username     | email             | password   |
      | John      | Doe      | thechosenone | john@example.com  | Fizer@2015 |
      | Alice     | Smith    | chillblinton | alice@example.com | Fizer@2015 |
      | David     | Brown    | greenday     | david@example.com | Fizer@2015 |
    When new users attempt to register with those emails
      | firstName | lastName | username      | email              | password   |
      | Bill      | Bob      | the_chosenone1 | john@example.com  | Fizer@2015 |
      | Max       | Samson   | !chillblinton2 | alice@example.com | Fizer@2015 |
      | Will      | Steff    | greenday@3     | david@example.com | Fizer@2015 |
    Then they should see an error notifying them that the account already exists
    And they should not be sent access to account details

  Scenario: Username already taken
    Given a set of users have already created their accounts with valid details
      | firstName | lastName | username     | email              | password   |
      | John      | Doe      | thechosenone | john1@example.com  | Fizer@2015 |
      | Alice     | Smith    | chillblinton | alice2@example.com | Fizer@2015 |
      | David     | Brown    | greenday     | david3@example.com | Fizer@2015 |
    When new users attempt to register with already taken usernames
      | firstName | lastName | username     | email                 | password   |
      | Bill      | Bob      | thechosenone | billy@billbob.com     | Fizer@2015 |
      | Max       | Samson   | chillblinton | maxsamson@example.com | Fizer@2015 |
      | Will      | Steff    | greenday     | willsteff@example.com | Fizer@2015 |
    Then they see an error notifying them that the username has already been taken
    And they should not be sent access to account details
