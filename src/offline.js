Verso.Offline = {
    version: '<!-- @echo VERSION -->',
    cards: []
};

var validateCardData = function () {
    var password = $('#password').val(),
        passwordConfirm = $('#passwordConfirm').val(),
        accountName = $('#accountName').val(),
        messages = [];

    if (password !== passwordConfirm) {
        messages.push("Passwords don't match");
    }
    if (password.length < 6 || password.length > 100) {
        messages.push("Password must be between 6 and 100 characters long");
    }
    if (accountName.length > 20) {
        messages.push("Account name cannot be longer than 20 characters");
    }

    if (messages.length === 0) {
        $('#cardData .error').hide();
        $('#errorMessages').html('');
        return true;
    } else {
        $('#errorMessages').html(messages.reduce(function (prev, curr) {
            return prev + '<li>' + curr + '</li>';
        }, ''));
        $('#cardData .error').show();
        return false;
    }
};

var clearCardData = function () {
    $('#accountName').val('');
    $('#password').val('');
    $('#passwordConfirm').val('');
    $('#cardData .error').hide();
    $('#errorMessages').html('');
};

var updateOrder = function () {
    var cards = Verso.Offline.cards;
    if (cards.length === 0) {
        // Add "no cards" row
        $('#cards tbody').html('<tr class="none"><td colspan="3">No cards yet.</td></tr>');

        // Empty serialized order
        $('#orderData').val('');
    } else {
        // Add cards to the table
        $('#cards tbody').html('');
        for (var i = 0; i < cards.length; i++) {
            $('#cards tbody').append('<tr><td>Silver</td><td>' + cards[i].accountName + '</td><td><button class="remove" data-id="' + i +'">Remove</button></td></tr>');
        }
        $('.remove').on('click', function () {
            $(this).prop("disabled", true);
            cards.splice($(this).data('id'), 1);
            updateOrder();
        });

        // Update serialized order
        var order = {
            version: Verso.Offline.version,
            cards: cards,
            coldOrderKey: Verso.Offline.orderKey.coldOrderKey
        };
        $('#orderData').val(JSON.stringify(order));
    }

};

$(document).ready(function () {
    updateOrder();

    $('#cancelCard').on('click', function (e) {
        e.preventDefault();
        clearCardData();
    });

    $('#saveCard').on('click', function (e) {
        e.preventDefault();
        $('#cardData').trigger('submit');
    });

    $('#cardData').on('submit', function (e) {
        e.preventDefault();

        if (!validateCardData()) {
            return false;
        }

        $(this).prop("disabled", true);

        if (Verso.Offline.orderKey === undefined) {
            Verso.Offline.orderKey = Verso.Order.newKey();
        }

        var version = 0;
        var password = $('#password').val();
        var accountName = $('#accountName').val();
        var card = Verso.Order(version, password, accountName, Verso.Offline.orderKey);
        Verso.Offline.cards.push(card);

        updateOrder();
        clearCardData();
        $(this).prop("disabled", false);
    });


});
