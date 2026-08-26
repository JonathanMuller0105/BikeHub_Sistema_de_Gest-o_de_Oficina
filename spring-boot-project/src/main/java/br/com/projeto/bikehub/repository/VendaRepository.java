package br.com.projeto.bikehub.repository;

import br.com.projeto.bikehub.entity.Venda;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {
    List<Venda> findAllByOrderByDataVendaDescIdDesc();
}
