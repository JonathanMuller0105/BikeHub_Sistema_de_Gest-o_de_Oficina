package br.com.projeto.bikehub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ======================================================================
 * CLASSE PRINCIPAL DE INICIALIZAÇÃO - BIKEHUB APPLICATION
 * ======================================================================
 * Esta classe é o ponto de entrada (Entry Point) da aplicação Spring Boot.
 * A anotação @SpringBootApplication habilita:
 * 1. @Configuration: Permite definir beans no contexto do Spring.
 * 2. @EnableAutoConfiguration: Configura automaticamente os módulos baseados
 *    nas dependências presentes no pom.xml (JPA, Web, Thymeleaf, MySQL).
 * 3. @ComponentScan: Varre recursivamente o pacote 'br.com.projeto.bikehub'
 *    para encontrar @Controller, @Service, @Repository e @Component.
 *
 * @author Equipe de Engenharia BikeHub
 * @version 1.0.0
 */
@SpringBootApplication
public class BikeHubApplication {

    /**
     * Método principal que inicializa o container do Spring Boot e o servidor Tomcat embutido.
     *
     * @param args Argumentos de linha de comando passados na inicialização da aplicação
     */
    public static void main(String[] args) {
        // Inicializa o contexto da aplicação e todos os componentes gerenciados
        SpringApplication.run(BikeHubApplication.class, args);
        System.out.println("==========================================================");
        System.out.println("  SISTEMA BIKEHUB INICIADO COM SUCESSO!");
        System.out.println("  Acesse no navegador: http://localhost:8080/login");
        System.out.println("  Credenciais de teste: Usuário: Admin1234 | Senha: Admin123456");
        System.out.println("==========================================================");
    }
}
