# AngularJS Application Example

The application is an implementation of carousel (slideshow). The carousel supports image and video slides.

Carousel and slides are implemented as directives.

The snippet `<carousel slides="slides"></carousel>` creates a carousel instance. Here **slides** is an array of objects that describe slides.

Here is a sample of how the **slides** parameter might look:
```
var slides = [{
      type: 'photo',
      url: 'media/hk.jpg',
      diration: 3,
      transition: 'fadeOut',
      transitionDuration: 1
  }, {
      type: 'video',
      url: 'media/london.mp4',
      transition: 'fadeOut',
      transitionDuration: 1
  }];
```

The description of slide's posible parameters and their values is given below:

- **type** - the slide type, which might be equal to *photo* or *video*;
- **url** - the slide URL;
- **duration** - the time during which a slide should be shown (applied for photos only);
- **transition** - the animation type which should be applied during hiding the slide, currently supported values are *linear* and *unset*;
- **transitionDuration** - the time during which animation of the transitionis happening.








