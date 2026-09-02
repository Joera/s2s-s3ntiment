(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var submitBtn = document.getElementById('contact-submit');
  var feedback = document.getElementById('form-feedback');

  var nameInput = document.getElementById('contact-name');
  var emailInput = document.getElementById('contact-email');
  var messageInput = document.getElementById('contact-message');

  var errorName = document.getElementById('error-name');
  var errorEmail = document.getElementById('error-email');
  var errorMessage = document.getElementById('error-message');

  function clearErrors() {
    errorName.textContent = '';
    errorEmail.textContent = '';
    errorMessage.textContent = '';
    feedback.textContent = '';
    feedback.className = 'form-feedback';
  }

  function showFieldError(el, msg) {
    el.textContent = msg;
  }

  function showFeedback(msg, isError) {
    feedback.textContent = msg;
    feedback.className = 'form-feedback ' + (isError ? 'feedback-error' : 'feedback-success');
  }

  function validate() {
    clearErrors();
    var valid = true;

    if (!nameInput.value.trim()) {
      showFieldError(errorName, 'Vul je naam in.');
      valid = false;
    }

    var email = emailInput.value.trim();
    if (!email) {
      showFieldError(errorEmail, 'Vul je e-mailadres in.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError(errorEmail, 'Geef een geldig e-mailadres.');
      valid = false;
    }

    if (!messageInput.value.trim()) {
      showFieldError(errorMessage, 'Schrijf een bericht.');
      valid = false;
    }

    return valid;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Versturen...';

    var data = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) {
        if (res.ok) return res.json();
        return res.json().then(function (body) {
          throw new Error(body.message || 'Er ging iets mis.');
        });
      })
      .then(function () {
        showFeedback('Bedankt! Je bericht is verzonden.', false);
        form.reset();
      })
      .catch(function (err) {
        showFeedback(err.message || 'Versturen mislukt. Probeer het opnieuw.', true);
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Verstuur';
      });
  });
})();
