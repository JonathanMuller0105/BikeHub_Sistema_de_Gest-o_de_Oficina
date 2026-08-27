package br.com.projeto.bikehub.exception;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "br.com.projeto.bikehub.controller.api")
public class GlobalRestExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validacao(MethodArgumentNotValidException exception) {
        Map<String, String> campos = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(erro ->
                campos.putIfAbsent(erro.getField(), erro.getDefaultMessage()));
        return resposta(HttpStatus.BAD_REQUEST, "Dados inválidos. Verifique os campos informados.", campos);
    }

    @ExceptionHandler({EntidadeNaoEncontradaException.class, IllegalArgumentException.class})
    public ResponseEntity<Map<String, Object>> naoEncontrado(RuntimeException exception) {
        return resposta(HttpStatus.NOT_FOUND, exception.getMessage(), null);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> conflito(DataIntegrityViolationException exception) {
        String mensagem = exception.getMessage() == null
                ? "A operação viola a integridade dos dados relacionados." : exception.getMessage();
        return resposta(HttpStatus.CONFLICT, mensagem, null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> interno(Exception exception) {
        return resposta(HttpStatus.INTERNAL_SERVER_ERROR,
                "Ocorreu um erro interno. Tente novamente ou contate o suporte.", null);
    }

    private ResponseEntity<Map<String, Object>> resposta(HttpStatus status, String mensagem,
                                                          Map<String, String> campos) {
        Map<String, Object> corpo = new LinkedHashMap<>();
        corpo.put("status", status.value());
        corpo.put("mensagem", mensagem);
        if (campos != null && !campos.isEmpty()) corpo.put("campos", campos);
        return ResponseEntity.status(status).body(corpo);
    }
}
