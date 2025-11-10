angular.module('formApp', [])
    .controller('HomeController', ['$scope', function($scope) {
        // --- Simulasi Data Pengguna ---
        // Dalam aplikasi nyata, data ini harus dimuat dari Session/LocalStorage setelah login.
        $scope.user = {
            nama: 'Nama Pengguna', // Ganti dengan nama pengguna yang login
            username: 'user_ktg'
        };
        // -----------------------------

        $scope.logout = function() {
            // Hapus status login (di aplikasi nyata, hapus token/session dari localStorage)
            alert('Anda telah logout.');
            window.location.href = 'login.html';
        };

        // Verifikasi apakah pengguna sudah login (jika data pengguna tidak ada, arahkan ke login)
        // if (!$scope.user.username) {
        //     window.location.href = 'login.html';
        // }
    }]);

// Mengintegrasikan controller yang sudah ada ke modul 'formApp'
// Agar tidak ada error saat home.html dipanggil.
// *Anda harus memindahkan semua controller (form.js, login.js, register.js, viewData.js) ke satu file besar
// atau memastikan semua file .js dimuat dengan benar di setiap halaman HTML.* // Untuk saat ini, kita akan asumsikan home.js, oliver.js, dan form.js akan di-import di halaman masing-masing.