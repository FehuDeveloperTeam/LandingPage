import requests
from datetime import datetime, timedelta
from .models import PokemonCard, PokemonSet

POKEMON_API_URL = "https://api.pokemontcg.io/v2"

class PokemonTCGService:
    """Servicio para interactuar con la API de Pokemon TCG"""
    
    @staticmethod
    def search_cards(name=None, set_id=None, types=None, rarity=None, page=1, page_size=20):
        """Busca cartas en la API"""
        query_parts = []
        
        if name:
            query_parts.append(f'name:"{name}*"')
        if set_id:
            query_parts.append(f'set.id:{set_id}')
        if types:
            query_parts.append(f'types:{types}')
        if rarity:
            query_parts.append(f'rarity:"{rarity}"')
        
        query = ' '.join(query_parts) if query_parts else '*'
        
        params = {
            'q': query,
            'page': page,
            'pageSize': page_size,
            'orderBy': '-set.releaseDate'
        }
        
        try:
            response = requests.get(f"{POKEMON_API_URL}/cards", params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            cards = []
            for card_data in data.get('data', []):
                card = PokemonTCGService._parse_card(card_data)
                cards.append(card)
            
            return {
                'cards': cards,
                'page': data.get('page', 1),
                'pageSize': data.get('pageSize', 20),
                'totalCount': data.get('totalCount', 0),
            }
        except requests.RequestException as e:
            print(f"Error al buscar cartas: {e}")
            return {'cards': [], 'page': 1, 'pageSize': 20, 'totalCount': 0}
    
    @staticmethod
    def get_card(card_id):
        """Obtiene una carta específica por ID"""
        try:
            response = requests.get(f"{POKEMON_API_URL}/cards/{card_id}", timeout=10)
            response.raise_for_status()
            data = response.json()
            return PokemonTCGService._parse_card(data.get('data', {}))
        except requests.RequestException as e:
            print(f"Error al obtener carta {card_id}: {e}")
            return None
    
    @staticmethod
    def get_sets():
        """Obtiene todos los sets disponibles"""
        try:
            response = requests.get(f"{POKEMON_API_URL}/sets", params={'orderBy': '-releaseDate'}, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            sets = []
            for set_data in data.get('data', []):
                sets.append({
                    'id': set_data.get('id'),
                    'name': set_data.get('name'),
                    'series': set_data.get('series'),
                    'totalCards': set_data.get('total', 0),
                    'releaseDate': set_data.get('releaseDate'),
                    'logo': set_data.get('images', {}).get('logo'),
                    'symbol': set_data.get('images', {}).get('symbol'),
                })
            return sets
        except requests.RequestException as e:
            print(f"Error al obtener sets: {e}")
            return []
    
    @staticmethod
    def get_rarities():
        """Obtiene todas las rarezas disponibles"""
        try:
            response = requests.get(f"{POKEMON_API_URL}/rarities", timeout=10)
            response.raise_for_status()
            return response.json().get('data', [])
        except requests.RequestException as e:
            print(f"Error al obtener rarezas: {e}")
            return []
    
    @staticmethod
    def get_types():
        """Obtiene todos los tipos disponibles"""
        try:
            response = requests.get(f"{POKEMON_API_URL}/types", timeout=10)
            response.raise_for_status()
            return response.json().get('data', [])
        except requests.RequestException as e:
            print(f"Error al obtener tipos: {e}")
            return []
    
    @staticmethod
    def _parse_card(card_data):
        """Parsea los datos de una carta de la API"""
        tcgplayer = card_data.get('tcgplayer', {})
        prices = tcgplayer.get('prices', {})
        
        # Buscar precio en diferentes variantes
        price_data = (
            prices.get('holofoil') or 
            prices.get('reverseHolofoil') or 
            prices.get('normal') or 
            prices.get('1stEditionHolofoil') or
            prices.get('unlimitedHolofoil') or
            {}
        )
        
        cardmarket = card_data.get('cardmarket', {})
        cardmarket_prices = cardmarket.get('prices', {})
        
        return {
            'id': card_data.get('id'),
            'name': card_data.get('name'),
            'supertype': card_data.get('supertype'),
            'subtypes': card_data.get('subtypes', []),
            'types': card_data.get('types', []),
            'hp': card_data.get('hp'),
            'set': {
                'id': card_data.get('set', {}).get('id'),
                'name': card_data.get('set', {}).get('name'),
                'series': card_data.get('set', {}).get('series'),
                'releaseDate': card_data.get('set', {}).get('releaseDate'),
                'logo': card_data.get('set', {}).get('images', {}).get('logo'),
                'symbol': card_data.get('set', {}).get('images', {}).get('symbol'),
            },
            'rarity': card_data.get('rarity'),
            'number': card_data.get('number'),
            'artist': card_data.get('artist'),
            'images': {
                'small': card_data.get('images', {}).get('small'),
                'large': card_data.get('images', {}).get('large'),
            },
            'attacks': card_data.get('attacks', []),
            'weaknesses': card_data.get('weaknesses', []),
            'resistances': card_data.get('resistances', []),
            'retreatCost': card_data.get('retreatCost', []),
            'flavorText': card_data.get('flavorText'),
            'prices': {
                'tcgplayer': {
                    'low': price_data.get('low'),
                    'mid': price_data.get('mid'),
                    'high': price_data.get('high'),
                    'market': price_data.get('market'),
                    'url': tcgplayer.get('url'),
                },
                'cardmarket': {
                    'averageSellPrice': cardmarket_prices.get('averageSellPrice'),
                    'trendPrice': cardmarket_prices.get('trendPrice'),
                    'url': cardmarket.get('url'),
                }
            }
        }