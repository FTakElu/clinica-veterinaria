package com.clinicaveterinaria.clinicaveterinaria.controller;

import com.clinicaveterinaria.clinicaveterinaria.model.dto.AuthDTO;
import com.clinicaveterinaria.clinicaveterinaria.model.dto.ClienteDTO;
import com.clinicaveterinaria.clinicaveterinaria.model.dto.TokenResponseDTO;
import com.clinicaveterinaria.clinicaveterinaria.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> login(@RequestBody @Valid AuthDTO authDTO) {
        TokenResponseDTO token = authService.login(authDTO);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/register/cliente")
    public ResponseEntity<ClienteDTO> registerCliente(@RequestBody @Valid ClienteDTO clienteDTO) {
        ClienteDTO newCliente = authService.registerCliente(clienteDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCliente);
    }

    // Exemplo: Somente SECRETARIO ou ADMIN pode registrar outros usuários
    @PostMapping("/register/secretario")
    // @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARIO')") // Proteja no SecurityConfig ou com @PreAuthorize
    public ResponseEntity<ClienteDTO> registerSecretario(@RequestBody @Valid ClienteDTO secretarioDTO) {
        // Use AuthService para registrar um secretário. Mapeie DTOs corretamente.
        // Secretário não é ClienteDTO, crie um SecretarioRegisterDTO ou use SecretarioDTO direto.
        // Por simplicidade, vou usar um cast para o exemplo, mas o ideal é ter um DTO específico.
        ClienteDTO newSecretario = authService.registerCliente(secretarioDTO); // Adapte para SecretarioDTO
        return ResponseEntity.status(HttpStatus.CREATED).body(newSecretario);
    }
}
