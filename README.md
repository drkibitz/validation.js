*Update: This is very old code, and was one of the last jQuery plugins I ever wrote. Don't be fooled by the commit dates.*

### Initiates events for HTML5 validation on provided elements.

For `$(selector).validation(conf)` to work correctly...
When no `form` is provided in `conf`, then all selected elements must be contained in the same form, or all selected elements must not be contained in any form. Otherwise all selected elements use what is provided explicitly by the value of `conf.form`.

Invalidation is a pattern I learned a while ago. Basically it means, "don't do anything, until something is wrong or has changed". How it is implemented here is that the `conf.className` is not applied to or removed from an element, until the first time the invalid event is fired from that element, which is triggered when `form.checkValidity()` is invoked.

### Things this thing does beyond the normal HTML5 spec:

1. Custom events triggered by this class: validinput, invalidinput, validchange, invalidchange

2. When an element is initiated, this automatically adds listeners for invalid, input (maybe), and change. Everything is automated to add and remove a CSS classes on the elements individually and forms. This also adds a few more pieces of 'missing' functionality to the form. Like is dispatching an invalid event itself, but for only the first element that dispatched one. Access to a Boolean 'form.validation.valid' property based on all elements, and an Array of invalid elements in 'form.validation.invalid'.

3. By default an element with the 'disabled' attribute validates automatically, and this is the HTML5 spec. I beleive this is wrong because disabling has to do with user interaction, not validation. So this has a configurable flag that lets them validate by enabling them temporarily, validating, then disabling again. This flag is true by default.

4. The pattern attribute does not work on the input 'number' type, and this is also to spec. But this does it with custom validation, allowing zip code matching and more, all while the numeric keyboard is in use.

5. If the element has been invalidated and valueMissing is true, then the CSS class is removed regardless of validitiy. Otherwise the CSS class is added based on overall validity, but again, only if the element has been invalidated. This is just a personal preference for prettier UI, but may be removed in the future.

Just to note, HTML5 ValidityStates:
- customError
- patternMismatch
- rangeOverflow
- rangeUnderflow
- stepMismatch
- tooLong
- typeMismatch
- valid
- valueMissing

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/drkibitz/validation.js/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
