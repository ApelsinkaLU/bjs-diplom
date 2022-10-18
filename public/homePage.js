/*jshint esversion: 7 */
'use strict';

//Выход из лк
const logout = new LogoutButton();
logout.action = () => ApiConnector.logout(response => {
    if (response.success) {
        location.reload();
        return;
    }
});


//Получение информации о пользователе
ApiConnector.current(current => {
    if (current.success) {
        ProfileWidget.showProfile(current.data);
        return;
    }
});

//Получение курсов валюты
const ratesBoard = new RatesBoard();

function requestForRates() {
    ApiConnector.getStocks(response => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
            return;
        }
    });
}
requestForRates();
setInterval(requestForRates(), 60000);

//Операции с деньгами
const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data => {
    ApiConnector.addMoney(data, (response) => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Баланс пополнен");
        } else {
            console.error(false, 'Ошибка пополнения баланса' + response.error);
        }
    });
});

moneyManager.conversionMoneyCallback = (data => {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Конвертация завершена");
        } else {
            console.error(false, 'Ошибка конвертации' + response.error);
        }
    });
});

moneyManager.sendMoneyCallback = (data => {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.moneyManager(true, "Перевод завершен успешно");
        } else {
            console.error(false, 'Ошибка перевода' + response.error);
        }
    });
});

//Работа с избранным
const favoritesWidget = new FavoritesWidget();

favoritesWidget.addUserCallback = (data => {
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success === true) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь добавлен");
        } else {
            favoritesWidget.setMessage(false, "Ошибка добавления в избранное: " + response.error);
        }
    });
});

favoritesWidget.removeUserCallback = (data => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if (response.success === true) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь удален");
        } else {
            favoritesWidget.setMessage(false, "Ошибка удаления из избранного: " + response.error);
        }
    });
});
