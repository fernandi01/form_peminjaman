// ... (kode FormController dan RegisterController yang sudah ada) ...

angular.module('formApp')
    .controller('LoginController', ['$scope', '$http', function($scope, $http) {
      $scope.loginData = {};
      $scope.done = false;

      $scope.submitLogin = function() {
        if ($scope.loginForm.$invalid) {
          alert('Mohon masukkan username dan password.');
          return;
        }

        $scope.done = true;

        const payload = {
          username: $scope.loginData.username,
          password: $scope.loginData.password
        };

        const endpoint = "URL_APPS_SCRIPT_LOGIN"; // Ganti dengan endpoint Login sebenarnya

        $http({
          method: 'POST',
          url: endpoint,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: new URLSearchParams(payload).toString()
        }).then(function success(response) {
          $scope.done = false;
          
          if (response.data.status === "SUCCESS") { 
            // =================================================================
            // KRITIS: Simpan data user di sisi klien (misalnya localStorage)
            // response.data HARUS mengembalikan nama lengkap, subseksi, dan wa
            // Agar bisa digunakan di Home dan form selanjutnya.
            // Contoh: localStorage.setItem('userData', JSON.stringify(response.data.user));
            // =================================================================

            alert('Login berhasil! Selamat datang.');
            // Mengubah pengalihan ke HOME.HTML
            window.location.href = 'home.html'; 
          } else {
            alert('Login gagal: ' + response.data.message);
          }
        }, function error(response) {
          $scope.done = false;
          alert('Terjadi kesalahan saat login. Coba lagi nanti.');
          console.error('Error during login:', response);
        });
      };
    }]);