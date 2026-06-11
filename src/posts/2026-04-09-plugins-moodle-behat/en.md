# Behat to test your Moodle™ plugins

A few weeks ago I gave a talk at [MoodleMoot España 2026](https://moodlemoot.es/mod/callforpaper/view.php?rid=59) about the Behat testing framework. The idea was to promote the use of Behat among the attendees and remove certain possible mental barriers such as; "Behat is something only used in Moodle core" or "it is only useful for plugins that are going to be published". We can define Behat as: a tool to test our developments "as a real user would", in an automated way.

Here is a summary of what I talked about, I hope it helps you take the first step.

## What is Behat?

Behat is a PHP *framework* for writing **functional tests** following the BDD philosophy (*Behavior Driven Development*). It is the PHP implementation of [Cucumber](https://cucumber.io/), and the nice thing is that the tests are written in an almost natural language: anyone can read a scenario and understand what is being checked, even if their main role is not a programmer's.

## PHPUnit vs Behat

In Moodle, we mainly have two testing frameworks. It is important to understand their differences to get the most out of them.

| | [PHPUnit](https://moodledev.io/general/development/tools/phpunit) | [Behat](https://moodledev.io/general/development/tools/behat) |
| --- | --- | --- |
| Approach | TDD | BDD |
| Type | Unit tests | Functional tests |
| Granularity | 1 test → 1 code function | 1 test → 1 feature |
| Level | Low level, read by programmers | High level, readable by anyone |

They don't compete. They complement each other. PHPUnit checks that your code runs without errors, while Behat checks that the feature behaves as the end user expects.

## You already use BDD without realising it

When someone asks you *"I want the upcoming calendar events to be visible from several pages"*, before writing a single line of code your head already defines the **expected behaviour**: what information has to be shown, what type of plugin you need, and who can see it. That, in essence, is already BDD. Behat just gives you a way to write it down so the machine can verify it for you.

## The anatomy of a test

A Behat test is built with a few pieces:

- **Feature**: a set of *Scenarios*.
- **Scenario**: a list of *Steps*.
- **Step**: a sentence describing an action. There are several types: `Given` (initial context), `When` (action), `Then` (result), and `And` (to avoid repeating keywords).
- **Gherkin**: the language of the tests; each sentence calls a PHP function under the hood.
- **Background**: groups the `Given` steps that are repeated across several scenarios.
- **Tags**: labels to classify the tests (`@javascript`, `@block`, `@local_mylittleplugin`...).

And underneath, **Selenium** automates a real browser so the steps can interact with your Moodle instance.

## Writing your first test

My recipe to get started is four questions:

1. **What do I want to test?** The general behaviour, the key features, the success and error messages, and the edge cases.
2. **How do I start?** You create the file `<plugin>/tests/behat/my_first_test.feature` and write Gherkin.
3. **Which steps already exist?** In `admin/tool/behat` (Step definitions) you have a search tool with all the available steps. Don't reinvent the wheel!
4. **Read the docs!** Read the tests of similar plugins as if they were your favourite novel.

A real scenario, from core itself, is this readable:

```gherkin
@block @block_calendar_upcoming @javascript
Feature: Add the Upcoming events block in a course,
  create a site event and check that it is shown in the block.

  Background:
    Given the following "users" exist:
      | username | firstname | lastname  | email                | idnumber |
      | teacher1 | Héctor    | Benedicte | hector@hectorsnb.com | t1       |
    And the following "blocks" exist:
      | blockname         | contextlevel | reference | pagetypepattern | defaultregion |
      | calendar_upcoming | System       | 1         | site-index      | side-pre      |

  Scenario: See a site event in the Upcoming events block
    Given I log in as "admin"
    And I create a calendar event with form data:
      | Type of event | site                        |
      | Event title   | MoodleMoot España 2026      |
      | Description   | The best event in the world |
    And I log out
    When I log in as "teacher1"
    And I am on site homepage
    Then I should see "MoodleMoot España 2026" in the "Upcoming events" "block"
```

You can see it for yourself if you don't believe me: [public/blocks/calendar_upcoming/tests/behat/block_calendar_upcoming_frontpage.feature](https://github.com/moodle/moodle/blob/main/public/blocks/calendar_upcoming/tests/behat/block_calendar_upcoming_frontpage.feature)

## Setting up the test environment

Here comes the *plot twist*: **Behat tests run on another Moodle instance**, separate from the production one. You need four things —a Moodle instance, a browser (Firefox or Chrome), Selenium, and Java— and to follow these steps:

1. Start the Selenium Server: `java -jar selenium-server-4.41.0.jar standalone`.
2. Have the browser installed and accessible from the `$PATH`.
3. Add the Behat configuration to your `config.php` (`behat_wwwroot`, `behat_prefix`, `behat_dataroot`, `behat_faildump_path`...).
4. Initialise the environment: `php admin/tool/behat/cli/init.php`.

When it finishes you will have some new tables in the database, a dedicated `moodledata_behat`, and the acceptance environment ready to use.

## Running and debugging

Running a test is as simple as:

```bash
vendor/bin/behat --config behat.yml my_first_test.feature
```

A couple of tricks I showed in the talk:

- **`And I pause`** stops the execution so you can see what is happening in the browser. Ideal for going slowly.
- **`--format=pretty --out=.../pretty.txt`** dumps the result to a file, very useful for reviewing errors calmly.
- If you touch a `.feature` and it starts failing in a weird way, run `init.php` again: very often the environment needs to be reinitialised.
- And if you like comfort, [PHPStorm runs Behat](https://www.jetbrains.com/help/phpstorm/using-behat-framework.html) directly from the IDE.

## Going further: your own entities and steps

When the built-in steps and data fall short, Moodle lets you extend them:

- **Your own entities**: a *data generator* (`behat_<component>_generator`) lets you create your own objects or database records with a `Given`.
- **Your own steps**: if no existing sentence fits, you define yours in a `behat_<plugin>.php` class that, under the hood, runs whatever PHP code you want.

## Good practices

- Test **a single feature per Scenario**.
- Avoid CSS and XPath selectors whenever you can. Remember that the goal is to write tests readable by everyone.
- Keep `/tests/behat` tidy: descriptive names and a `fixtures` folder.
- Avoid unnecessary steps: reach your destination by the shortest path.
- [And don't forget about accessibility](https://moodledev.io/general/development/policies/accessibility/testing#accessibility-tests-using-behat): with `And the page should meet accessibility standards` you can check compliance with **WCAG 2.1 level AA**.

## Allies and resources

You are not alone in this. Some tools I mentioned: `admin/tool/behat`, [MDLCode](https://mdlcode.dev/), [Moodle Plugin CI](https://moodlehq.github.io/moodle-plugin-ci/), [MDK](https://moodledev.io/general/development/tools/mdk), and GitHub Copilot with the Moodle *instructions*. To keep learning, [Moodle Academy](https://moodle.academy/course/view.php?id=158) has a whole course on *Acceptance Testing with Behat*, and the official documentation for [Moodle](https://moodledev.io/general/development/tools/behat), [Gherkin](https://cucumber.io/docs/gherkin/reference), and [Behat](https://docs.behat.org/en/latest/) is excellent.

## Wrapping up

Yes, Behat has an initial learning curve. But in the medium term those hours pay off handsomely: it detects regressions automatically and saves you a lot of unexpected scares. Your plugins are asking you for it. 😉

#moodler #testing #bdd #behat #phpunit

---
