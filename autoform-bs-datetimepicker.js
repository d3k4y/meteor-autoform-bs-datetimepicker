/* eslint-disable default-case */
AutoForm.addInputType("bootstrap-datetimepicker", {
  template: "afBootstrapDateTimePicker",
  valueIn: function (val, atts) {
    // datetimepicker expects the date to represent local time,
    // so we need to adjust it if there's a timezoneId specified
    var timezoneId = atts.timezoneId;
    if (typeof timezoneId === "string") {
      if (typeof moment.tz !== "function") {
        throw new Error("If you specify a timezoneId, make sure that you've added a moment-timezone package to your app");
      }
      if (val instanceof Date) {
        return moment(AutoForm.Utility.dateToNormalizedLocalDateAndTimeString(val, timezoneId), "YYYY-MM-DD[T]HH:mm:ss.SSS").toDate();
      }
    }

    return val;
  },
  valueOut: function () {
    var datePicker = this.data("DateTimePicker");
    var m = datePicker ? datePicker.date() : null;

    if (!m) {
      return m;
    }

    return m.toDate();
  },
  valueConverters: {
    "string": function (val) {
      var datePicker = this.data("DateTimePicker");

      if (!datePicker) {
        return '';
      }

      var timezoneId = this.attr("data-timezone-id");

      var format = datePicker.format();
      var result = val;
      if (val instanceof Date) {
        // default is local, but if there's a timezoneId, we use that
        result = typeof timezoneId === "string" ? moment(val).tz(timezoneId).format(format) : moment(val).format(format);
      }

      return result;
    },
    "stringArray": function (val) {
      if (val instanceof Date) {
        return [val.toString()];
      }
      return val;
    },
    "number": function (val) {
      return (val instanceof Date) ? val.getTime() : val;
    },
    "numberArray": function (val) {
      if (val instanceof Date) {
        return [val.getTime()];
      }
      return val;
    },
    "dateArray": function (val) {
      if (val instanceof Date) {
        return [val];
      }
      return val;
    }
  },
  contextAdjust: function (context) {
    if (context.atts.timezoneId) {
      context.atts["data-timezone-id"] = context.atts.timezoneId;
    }
    delete context.atts.timezoneId;
    return context;
  }
});

Template.afBootstrapDateTimePicker.helpers({
  atts: function addFormControlAtts() {
    var atts = _.clone(this.atts);
    // Add bootstrap class
    atts = AutoForm.Utility.addClass(atts, "form-control");
    delete atts.dateTimePickerOptions;
    return atts;
  }
});

Template.afBootstrapDateTimePicker.rendered = function () {
  var $input = this.$('input');
  var data = this.data;
  var opts = data.atts.dateTimePickerOptions || {};

  // To be able to properly detect a cleared field, the defaultDate,
  // which is "" by default, must be null instead. Otherwise we get
  // the current datetime when we call getDate() on an empty field.
  if (!opts.defaultDate || opts.defaultDate === "") {
    opts.defaultDate = null;
  }

  var updateOpts = function(dtp) {
    _.keys(opts).forEach(key => {
      switch (key) {
        case 'format': dtp.format(opts[key]);
      }
    });
  };

  // instanciate datetimepicker
  $input.datetimepicker(opts);
  $input.on('dp.change', function (foo, bar, bla) {
    var dtp = $input.data("DateTimePicker");
    updateOpts(dtp);
    window.$($input[0]).change();
    setTimeout(function() {
      updateOpts(dtp);
      $input.change();
      $input.data('changed', 'true');
    }, 100);

    // $input[0].value = JSON.stringify(sliderElem.noUiSlider.get());
    $input.change();
    $input.data('changed', 'true');
  });

  // set and reactively update values
  this.autorun(function () {
    var data = Template.currentData();
    var dtp = $input.data("DateTimePicker");

    // set field value
    if (data.value instanceof Date || data.value instanceof moment) {
      dtp.date(data.value);
    } else {
      dtp.date(); // clear
    }

    // set start date if there's a min in the schema
    if (data.min instanceof Date) {
      dtp.minDate(data.min);
    }

    // set end date if there's a max in the schema
    if (data.max instanceof Date) {
      dtp.maxDate(data.max);
    }

    updateOpts(dtp);
  });

};

Template.afBootstrapDateTimePicker.destroyed = function () {
  var dtp = this.$('input').data("DateTimePicker");
  if (dtp) {
    dtp.destroy();
  }
};
