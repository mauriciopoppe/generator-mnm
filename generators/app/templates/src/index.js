/*
 * <%= slugname %>
 *
 * Copyright (c) <%= currentYear %><% if (props.authorName) { %> <%= props.authorName %><% } %>
 * Licensed under the <%= props.license %> license.
 */
'use strict'

export default awesome => {
  return `everything is <%= "${awesome}" %>`
}
