/*jshint esversion: 6 */
/* jshint jquery: true, browser: true, devel:true*/

/* eslint-env browser, es6, jquery */
/*eslint no-console: ["error", { allow: ["log"] }] */
/* eslint no-mixed-spaces-and-tabs: ["error", "smart-tabs"] */


/*
 *
 * Setup should start once the api is loaded
 *
 * Note -  add 'notranslate' class to those words which should not be translated by google translate
 *
 */
var translateLanguage = {
  config: {
    translateActive: false,
    langUserSelectElement: '.lang',
    customTranslateElement: '.m_menu',
    mutationActive: true, // to use Mutation Observable for user experience
    customTranslate: true,
    useCookie: false,
    google: {
      googleElementId: '#google_translate_element',
      iframeTargetElement: 'iframe.goog-te-menu-frame',
      dropdownTargetElementByID: `div[id=':1.menuBody']`,
      dropdownTarget: '.goog-te-menu2-item',
      dropdownTargetSelected: '.goog-te-menu2-item-selected',
      cookieName: 'googtrans',
      timeout: 500,
      noOfTries: 60 // a total of 30 seconds to check the whether google is loaded in absence of MutationObservable
    },
    language: { // a configuration b/w user-defined and Google-defined (can add more languages)
      defaults: 'Select Language',
      en: 'English',
      hi: 'Hindi'
    },
    mutationObservable: {
      supported: true,
      targetElementId: 'observableElementTarget',
      config: {
        characterData: false,
        attributes: true,
        childList: true,
        subtree: false
      }
    }
  },
  workspace: {
    previousElementlangId: 'en',
    currentElementLangId: '',
    sourceTargetElement: null,
    observable: null,
    noOfIterationForSetup: 0 // only for setup purposes
  },
  setup: function () {
    $(this.config.langUserSelectElement).click(function (event) {
      translateLanguage.workspace.sourceTargetElement = $(this);
      translateLanguage.run();
    });

    this.isMutationObservableSupported(); // to test if mutation observable is supported in user browser
    if (this.config.mutationObservable.supported && this.config.mutationActive) {
      $(this.config.google.googleElementId).append(this.addObserveTarget());
    }

    $(this.config.customTranslateElement).addClass('notranslate'); // prevent translation of custom translate words
    this.processSetupFromUserPreferences();
  },
  processSetupFromUserPreferences: function () {
    this.isGoogleLoaded(function (flag) {
      if (flag) {
        translateLanguage.config.translateActive = true;
        translateLanguage.workspace.currentElementLangId = translateLanguage.getGoogleSetCookie();

        if (translateLanguage.workspace.currentElementLangId != translateLanguage.workspace.previousElementlangId) {
          translateLanguage.doCustomTranslate();
        } else {
          $('.top-links.lang_a').find('a[id="' + translateLanguage.workspace.currentElementLangId + '"]').addClass('done');
          $('.' + translateLanguage.workspace.currentElementLangId + '_logo').show();
        }
        translateLanguage.clearWorkspace();
      }
    });
  },
  isGoogleLoaded: function (callback) {
    if (this.workspace.noOfIterationForSetup == this.config.google.noOfTries) {
      callback(false);
    }

    if (this.config.mutationObservable.supported) {
      setTimeout(function () {
        var status = translateLanguage.startObserve(translateLanguage.returnIframeDropDown(), function () {
          callback(true);
        });

        if (!status) {
          console.log("Threwed error");
          ++translateLanguage.workspace.noOfIterationForSetup;
          translateLanguage.isGoogleLoaded(callback);
        }
      }, 100);
    } else {
      alert("Translation not supported for this browser yet");
      callback(false);
    }
  },
  isGoogleTranslateAvailable: function () {
    try {
      var test = this.returnIframeDropDown();
      if (!test.html().length) {
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  },
  isMutationObservableSupported: function () {
    if (!window.MutationObserver) {
      this.config.mutationObservable.supported = false;
    }
  },
  getCookieValue: function (name) {
    if (!name || !(name.trim().length)) {
      throw "Invalid parameters";
    }

    var ar = document.cookie.split(';');
    var value;

    for (var i = 0; i < ar.length; i++) {
      var part = ar[i];
      part = part.split('=');
      if (part[0].indexOf(name) != -1) {
        value = part[1];
        break;
      }
    }
    return value;
  },
  getGoogleSetCookie: function () {
    var value = this.getCookieValue(this.config.google.cookieName);

    if (!value) {
      return "en"; // as default language if not available
    }

    value = value.trim();
    value = value.split('/');
    return value.pop();
  },
  startObserve: function (targetLocation, callback) {
    this.manipulateObserveTarget(true);

    this.workspace.observable = new MutationObserver(function (mutations) {
      console.log('Mutation Change detected');
      translateLanguage.workspace.observable.disconnect();
      translateLanguage.manipulateObserveTarget(false);
      callback();
    });

    try {
      this.workspace.observable.observe($(targetLocation)[0], this.config.mutationObservable.config);
      return true;
    } catch (err) {
      return false;
    }
  },
  addObserveTarget: function () {
    return '<div id="' + this.config.mutationObservable.targetElementId + '" style="display: none;"></div>';
  },
  manipulateObserveTarget: function (flag) { // true - set text || false - remove text
    if (flag) {
      $('#' + this.config.mutationObservable.targetElementId).text('test');
    } else {
      $('#' + this.config.mutationObservable.targetElementId).text('');
    }
  },
  clearWorkspace: function () {
    if (this.workspace.currentElementLangId.length) {
      this.workspace.previousElementlangId = this.workspace.currentElementLangId;
    }

    this.workspace.currentElementLangId = '';
    this.workspace.sourceTargetElement = null;
  },
  doCustomTranslate: function () { // translate all custom elements text
    console.log("pre  " + this.workspace.currentElementLangId);
    console.log("now  " + this.workspace.previousElementLangId);

    $('.top-links.lang_a').find('a[id="' + this.workspace.currentElementLangId + '"]').addClass('done');
    $('.top-links.lang_a').find('a[id="' + this.workspace.previousElementLangId + '"]').removeClass('done');

    $('.' + this.workspace.currentElementLangId + '_logo').show();
    $('.' + this.workspace.previousElementLangId + '_logo').hide();

    $(this.config.customTranslateElement).each(function (index) {
      $(this).text(aLangKeys[translateLanguage.workspace.currentElementLangId][$(this).attr('key')]);
    });
  },
  determineLangSelected: function () {
    return $(this.workspace.sourceTargetElement).attr('id');
  },
  returnIframeDropDown: function () {
    return $(this.config.google.iframeTargetElement).contents().find(this.config.google.dropdownTargetElementByID);
  },
  testDropDown: function () {
    var locate = this.returnIframeDropDown();
    return (($(locate).find(':contains(' + this.config.language.defaults + ')').length) ? true : false);
  },
  tarnslate: function () {
    if (!this.workspace.currentElementLangId) {
      alert('Error in translation');
      this.clearWorkspace();
      return false;
    }

    if (!this.config.mutationObservable.supported || !this.config.translateActive) {
      alert('Translation not available yet');
      this.clearWorkspace();
      return false;
    }

    if (this.workspace.currentElementLangId == this.workspace.previousElementlangId) {
      this.clearWorkspace();
      return false;
    }

    console.log("the data  " + this.workspace.currentElementLangId);
    var locate = this.returnIframeDropDown();
    var target = $(locate).find(this.config.google.dropdownTarget + ':contains(' + this.config.language[this.workspace.currentElementLangId] + ')');

    // registering observable for translation
    this.startObserve(('#' + translateLanguage.config.mutationObservable.targetElementId), function () {
      if (translateLanguage.config.customTranslate) {
        translateLanguage.doCustomTranslate();
      }
      translateLanguage.clearWorkspace();
      return true;
    });

    // make the translation
    $(target)[0].click();
    if (this.testDropDown()) { // testing the dropdown box
      $(target)[0].click();
    }
  },
  run: function () {
    this.workspace.currentElementLangId = this.determineLangSelected();
    this.tarnslate();
  }
};

$(document).ready(function () {
  translateLanguage.setup();
});
