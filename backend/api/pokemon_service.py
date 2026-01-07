import requests

TCGDEX_API = "https://api.tcgdex.net/v2/en"

class PokemonTCGService:
    
    @staticmethod
    def search_cards(name=None, set_id=None, types=None, rarity=None):
        try:
            params = {}
            if name:
                params['name'] = name
            if set_id:
                params['set'] = set_id
            if types:
                params['type'] = types
            if rarity:
                params['rarity'] = rarity
            
            response = requests.get(
                f"{TCGDEX_API}/cards",
                params=params if params else None,
                timeout=15
            )
            response.raise_for_status()
            data = response.json()
            
            cards = []
            if isinstance(data, list):
                for card in data[:100]:
                    cards.append(PokemonTCGService._parse_card_list(card))
            
            return {
                'cards': cards,
                'totalCount': len(cards)
            }
        except requests.RequestException as e:
            print(f"Error al buscar cartas: {e}")
            return {'cards': [], 'totalCount': 0}
    
    @staticmethod
    def get_card(card_id):
        try:
            response = requests.get(
                f"{TCGDEX_API}/cards/{card_id}",
                timeout=15
            )
            response.raise_for_status()
            data = response.json()
            return PokemonTCGService._parse_card_detail(data)
        except requests.RequestException as e:
            print(f"Error al obtener carta {card_id}: {e}")
            return None
    
    @staticmethod
    def get_sets():
        try:
            response = requests.get(
                f"{TCGDEX_API}/sets",
                timeout=15
            )
            response.raise_for_status()
            data = response.json()
            
            sets = []
            if isinstance(data, list):
                for s in data:
                    sets.append({
                        'id': s.get('id'),
                        'name': s.get('name'),
                        'series': s.get('serie', {}).get('name', '') if isinstance(s.get('serie'), dict) else '',
                        'logo': s.get('logo'),
                        'symbol': s.get('symbol'),
                    })
            return sets
        except requests.RequestException as e:
            print(f"Error al obtener sets: {e}")
            return []
    
    @staticmethod
    def get_rarities():
        try:
            response = requests.get(
                f"{TCGDEX_API}/rarities",
                timeout=15
            )
            response.raise_for_status()
            data = response.json()
            return data if isinstance(data, list) else []
        except requests.RequestException as e:
            print(f"Error al obtener rarezas: {e}")
            return []
    
    @staticmethod
    def get_types():
        try:
            response = requests.get(
                f"{TCGDEX_API}/types",
                timeout=15
            )
            response.raise_for_status()
            data = response.json()
            return data if isinstance(data, list) else []
        except requests.RequestException as e:
            print(f"Error al obtener tipos: {e}")
            return []
    
    @staticmethod
    def _parse_card_list(card):
        image_base = card.get('image')
        return {
            'id': card.get('id'),
            'name': card.get('name'),
            'image_small': f"{image_base}/low.webp" if image_base else None,
            'image_large': f"{image_base}/high.webp" if image_base else None,
            'set_name': card.get('set', {}).get('name', '') if isinstance(card.get('set'), dict) else '',
            'rarity': card.get('rarity'),
        }
    
    @staticmethod
    def _parse_card_detail(card):
        if not card:
            return None
        
        image_base = card.get('image')
        set_data = card.get('set') or {}
        if not isinstance(set_data, dict):
            set_data = {}
        
        pricing_data = card.get('pricing') or {}
        if not isinstance(pricing_data, dict):
            pricing_data = {}
        
        # Extraer precios de Cardmarket (EUR)
        cardmarket = pricing_data.get('cardmarket') or {}
        if not isinstance(cardmarket, dict):
            cardmarket = {}
        
        cardmarket_prices = {
            'low': cardmarket.get('low'),
            'avg': cardmarket.get('avg'),
            'trend': cardmarket.get('trend'),
            'avg1': cardmarket.get('avg1'),
            'avg7': cardmarket.get('avg7'),
            'avg30': cardmarket.get('avg30'),
            'currency': cardmarket.get('unit', 'EUR'),
            'updated': cardmarket.get('updated'),
        }
        
        # Extraer precios de TCGPlayer (USD)
        tcgplayer = pricing_data.get('tcgplayer') or {}
        if not isinstance(tcgplayer, dict):
            tcgplayer = {}
        
        tcgplayer_holofoil = tcgplayer.get('holofoil') or {}
        tcgplayer_normal = tcgplayer.get('normal') or {}
        
        # Usar holofoil si existe, sino normal
        tcg_prices = tcgplayer_holofoil if tcgplayer_holofoil else tcgplayer_normal
        if not isinstance(tcg_prices, dict):
            tcg_prices = {}
        
        tcgplayer_prices = {
            'low': tcg_prices.get('lowPrice'),
            'mid': tcg_prices.get('midPrice'),
            'high': tcg_prices.get('highPrice'),
            'market': tcg_prices.get('marketPrice'),
            'currency': tcgplayer.get('unit', 'USD'),
            'updated': tcgplayer.get('updated'),
        }
        
        return {
            'id': card.get('id'),
            'name': card.get('name'),
            'types': card.get('types') or [],
            'hp': card.get('hp'),
            'set': {
                'id': set_data.get('id'),
                'name': set_data.get('name'),
                'series': set_data.get('serie', {}).get('name', '') if isinstance(set_data.get('serie'), dict) else '',
                'logo': set_data.get('logo'),
            },
            'rarity': card.get('rarity'),
            'number': card.get('localId'),
            'artist': card.get('illustrator'),
            'images': {
                'small': f"{image_base}/low.webp" if image_base else None,
                'large': f"{image_base}/high.webp" if image_base else None,
            },
            'attacks': card.get('attacks') or [],
            'weaknesses': card.get('weaknesses') or [],
            'resistances': card.get('resistances') or [],
            'retreat': card.get('retreat'),
            'description': card.get('description'),
            'abilities': card.get('abilities') or [],
            'prices': {
                'tcgplayer': tcgplayer_prices,
                'cardmarket': cardmarket_prices,
            }
        }