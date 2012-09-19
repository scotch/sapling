# TODO

This file contains task that are being work on or will be work on shortly.

If you would like to help with the development of Sapling, please follow these steps:

1. Select an item from the list that you would like to work on.
2. Search the the [issues track](https://github.com/scotch/sapling/issues/) to see if someone has begun work on the issue.
3. If the issue has not been started, create a [new issue](https://github.com/scotch/sapling/issues/new) outlining the problem as you understand it.
4. Create a fork of Sapling the project.
5. Solve the problem.
6. If this is your first time contributing add your name to CONTRIBUTERS.md and AUTHORS.md.
7. Create a pull request.

### Client
- Removed dependencies to Bootstrap, and jQuery.
- Improve testing suite. Ideas:
  - Packages test with packages
    mypackage/
      controllers.coffee
      controllers_test.coffee
  - Adapt testacular to read coffeescript directly
  - Integrate with Brunch's test suite.
- Sever angular.js using Google CDN in production

### Server
- Render and serve templates server side for web-crawlers
- Add XSRF middleware (http://docs.angularjs.org/api/ng.$http).